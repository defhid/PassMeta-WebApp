import { RestProtocolFactory } from "./base/restProtocolFactory";
import {
    createFieldsDeserializer,
    createListDeserializer,
    dateTimeDeserializer,
} from "./serialization";

export interface PassFilePostData {
    typeId: number;
    name: string;
    color: string | null;
    createdOn: Date;
}

export interface PassFileInfoDto
{
    id: number;
    userId: number;
    typeId: number;
    name: string;
    color: string | null;
    version: number;
    createdOn: Date;
    infoChangedOn: Date;
    versionChangedOn: Date;
}

export enum PassFileType
{
    Pwd = 1,
    Txt = 2,
}

const PassFileInfoDtoDeserializer = createFieldsDeserializer<PassFileInfoDto>({
    createdOn: dateTimeDeserializer,
    infoChangedOn: dateTimeDeserializer,
    versionChangedOn: dateTimeDeserializer,
});


/**
 * Passfile controllers.
 */
export const Passfile = {
    /**
     * Create a new passfile.
     */
    Post: RestProtocolFactory.json("POST", () => "passfiles/new", {
        body: (params: PassFilePostData) => params,
        deserialize: PassFileInfoDtoDeserializer,
    }),

    /**
     * Get passfile list.
     */
    GetList: RestProtocolFactory.json(
        "GET",
        (params: { ofType: PassFileType }) => `passfiles?type_id=${params.ofType}`,
        { deserialize: createListDeserializer(PassFileInfoDtoDeserializer) }),

    /**
     * Get passfile.
     */
    Get: RestProtocolFactory.json(
        "GET",
        (params: { passFileId: number }) => `passfiles/${params.passFileId}`,
        { deserialize: PassFileInfoDtoDeserializer }),


// /// Edit passfile.
// ///
// static IHttpRequestWithBodySupportBase Patch(long passFileId) => _Patch($"passfiles/{passFileId}");
//
// /// Delete passfile.
// ///
// static IHttpRequestWithBodySupportBase Delete(long passFileId) => _Delete($"passfiles/{passFileId}");
//
// /// Create a new passfile version content.
// ///
// static IHttpRequestWithBodySupportBase PostVersion(long passFileId) => _Post($"passfiles/{passFileId}/versions/new");
//
// /// Get passfile versions.
// ///
// static IHttpRequestBase GetVersionList(long passFileId) => _Get($"passfiles/{passFileId}/versions");
//
// /// Get passfile version content.
// ///
// static IHttpRequestBase GetVersion(long passFileId, int version) => _Get($"passfiles/{passFileId}/versions/{version}");
};
