/**
 * The possible type of game-related files.
 */
export enum GameFileType {
    /**
     * Statistics (in JSON format by default).
     */
    Statistics = 1,
    /**
     * League of Legends Replay (ROFL),
     */
    Replay = 2,
    /**
     * Video.
     */
    Video = 3,
    /**
     * Audio.
     */
    Audio = 4,
}

/**
 * The names of the game-related file types.
 */
const GameFileTypeNames: string[] = [];

GameFileTypeNames[GameFileType.Statistics] = 'stats';
GameFileTypeNames[GameFileType.Replay] = 'replay';
GameFileTypeNames[GameFileType.Video] = 'video';
GameFileTypeNames[GameFileType.Audio] = 'audio';

export { GameFileTypeNames };