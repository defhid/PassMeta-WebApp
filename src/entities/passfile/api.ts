import type {
    BodyCtrlPassfilesPassfileIdVersionsNewPost,
    CtrlPassfilesGetParams,
    FullResultDto,
    HttpResponse,
    PassfileDto,
    PassfileListDto,
    PassfilePatchDto,
    PassfileVersionDto,
    PassfileVersionListDto,
} from "~generated/api";
import { createFieldsDeserializer, createListDeserializer } from "~infra";
import { DateTimeDeserializer, RestProtocolFactory } from "~api";

const PassFileDtoDeserializer = createFieldsDeserializer<PassfileDto>({
    createdOn: DateTimeDeserializer,
    infoChangedOn: DateTimeDeserializer,
    versionChangedOn: DateTimeDeserializer,
});

const PassFileListDtoDeserializer = createFieldsDeserializer<PassfileListDto>({
    list: createListDeserializer(PassFileDtoDeserializer),
});

/**
 * Passfile controllers.
 */
export const PassFileApi = {
    /**
     * Create a new passfile.
     */
    post: RestProtocolFactory.fromGenerated<PassfileDto, PassfileDto>(
        (api, params) =>
            api.passfiles.ctrlPassfilesNewPost({
                name: params.name,
                color: params.color,
                typeId: params.typeId,
                createdOn: params.createdOn,
            }),
        { deserialize: PassFileDtoDeserializer },
    ),

    /**
     * Get passfile list.
     */
    getList: RestProtocolFactory.fromGenerated<CtrlPassfilesGetParams, PassfileListDto>(
        (api, params) => api.passfiles.ctrlPassfilesGet(params),
        { deserialize: PassFileListDtoDeserializer },
    ),

    /**
     * Get passfile.
     */
    get: RestProtocolFactory.fromGenerated<{ id: number }, PassfileDto>(
        (api, params) => api.passfiles.ctrlPassfilesPassfileIdGet(params.id),
        { deserialize: PassFileDtoDeserializer },
    ),

    /**
     * Edit passfile.
     */
    patch: RestProtocolFactory.fromGenerated<PassfilePatchDto & { id: number }, PassfileDto>(
        (api, { id, ...params }) => api.passfiles.ctrlPassfilesPassfileIdPatch(id, params),
        { deserialize: PassFileDtoDeserializer },
    ),

    /**
     * Delete passfile.
     */
    delete: RestProtocolFactory.fromGenerated<{ id: number }>((api, params) =>
        api.passfiles.ctrlPassfilesPassfileIdDelete(params.id),
    ),

    /**
     * Create a new passfile version content.
     */
    postVersion: RestProtocolFactory.fromGenerated<
        BodyCtrlPassfilesPassfileIdVersionsNewPost & { passfileId: number },
        PassfileDto
    >((api, { passfileId, ...params }) => api.passfiles.ctrlPassfilesPassfileIdVersionsNewPost(passfileId, params), {
        deserialize: PassFileDtoDeserializer,
    }),

    /**
     * Get passfile versions.
     */
    getVersionList: RestProtocolFactory.fromGenerated<{ passfileId: number }, PassfileVersionListDto>(
        (api, params) => api.passfiles.ctrlPassfilesPassfileIdVersionsGet(params.passfileId),
        {
            deserialize: createFieldsDeserializer<PassfileVersionListDto>({
                list: createListDeserializer(
                    createFieldsDeserializer<PassfileVersionDto>({
                        versionDate: DateTimeDeserializer,
                    }),
                ),
            }),
        },
    ),

    /**
     * Get passfile version content.
     */
    getVersion: RestProtocolFactory.fromGenerated<{ passfileId: number; version: number }, ArrayBuffer>(
        (api, params) =>
            api.passfiles.ctrlPassfilesPassfileIdVersionsVersionGet(params.passfileId, params.version, {
                format: "arrayBuffer",
            }) as unknown as Promise<HttpResponse<ArrayBuffer, FullResultDto>>,
    ),
};
