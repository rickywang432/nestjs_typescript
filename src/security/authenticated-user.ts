/**
 * Contains information about the authenticated user.
 */
export interface AuthenticatedUser {
    /**
     * The ID of the user.
     */
    readonly id: number;

    /**
     * The auth ID of the user.
     */
    readonly authId: number;

    /**
     * The summoners linked to the user.
     */
    readonly summoners?: AuthenticatedUserSummoner[] | undefined;

    /**
     * The ID of the player record (if any) to which the user is linked.
     */
    readonly playerId?: number | undefined;

    /**
     * Information about the team (if any) the user is a member of.
     */
    readonly teamMember?: AuthUserTeamMember | undefined;
}

/**
 * Contains information about the team the authenticated user is a member of.
 */
export interface AuthUserTeamMember {
    /**
     * The ID of the team (if any) the user is a member of.
     */
    readonly teamId: number;

    /**
     * The ID of the team member (if any) of the user.
     */
    readonly teamMemberId: number;
}

/**
 * Contains information about the summoners of an authenticated user. 
 */
export interface AuthenticatedUserSummoner {
    /**
     * The ID of the summoner.
     */
    readonly id: number;

    /**
     * The ID of the region.
     */
    readonly regionId: string;
}
