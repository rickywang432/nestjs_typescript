/**
 * Represents a GQL response.
 */
export interface GqlResponse<TData, DataPropertyName extends string> {
    /**
     * Data.
     */
    data: GqlResponseData<TData, DataPropertyName>;

    /**
     * Errors.
     */
    errors: GqlErrorModel[];
}

/**
 * Contains the data of a response.
 */
export type GqlResponseData<TData, DataPropertyName extends string> = {
    [P in DataPropertyName]: TData;
};

/**
 * Contains information about a GQL error.
 */
export interface GqlErrorModel {
    /**
     * Code.
     */
    code: string;

    /**
     * Message.
     */
    message: string;
}

/**
 * Contains information about the authenticated user.
 */
export interface GqlMeModel {
    /**
     * ID.
     */
    id: string;

    /**
     * Name.
     */
    name: string;

    /**
     * The summoners of the user.
     */
    summoners: GqlMeSummonerModel[];
}

/**
 * Contains information about the authenticated user's summoners.
 */
export interface GqlMeSummonerModel {
    /**
     * The ID of the summoner.
     */
    summonerId: string;
    /**
     * The region of the summoner.
     */
    region: string;
}