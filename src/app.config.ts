import * as Joi from '@hapi/joi';
import * as dotenv from 'dotenv';

dotenv.config();

const config = {
    environment: process.env.NODE_ENV,
    api: {
        host: process.env.API_HOST,
        port: process.env.API_PORT,
    },
    database: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        name: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        pass: process.env.DATABASE_PASS,
    },
    authServer: {
        url: process.env.AUTH_SERVER_URL,
    },
    aws: {
        fileS3BucketName: process.env.AWS_BUCKET_FILE_NAME,
        fileS3BucketRegion: process.env.AWS_BUCKET_FILE_REGION,
        fileS3BucketIsAccelerated: process.env.AWS_BUCKET_FILE_IS_ACCELERATED,
    },
};

const configSchema = Joi.object({
    environment: Joi.string()
        .valid('development', 'staging', 'production')
        .default('production'),
    api: {
        host: Joi.string().default('0.0.0.0'),
        port: Joi.number().default(3000),
    },
    database: {
        host: Joi.string().default('localhost'),
        port: Joi.number().default(5432),
        name: Joi.string().default('team_coaching'),
        user: Joi.string().required(),
        pass: Joi.string().required(),
    },
    authServer: {
        url: Joi.string(),
    },
    aws: {
        fileS3BucketName: Joi.string().required(),
        fileS3BucketRegion: Joi.string().optional(),
        fileS3BucketIsAccelerated: Joi.boolean().optional().default(false),
    },
});

const { error: validationError, value: validatedConfig } = configSchema.validate(config);
if (validationError) {
    throw new Error(`Configuration validation error: ${validationError.message}`);
}

interface AppConfig {
    readonly environment: 'development' | 'staging' | 'production';
    readonly api: AppConfigApi;
    readonly database: AppConfigDatabase;
    readonly authServer: AppConfigAuthServer;
    readonly aws: AppConfigAws;
}

interface AppConfigApi {
    readonly host: string;
    readonly port: number;
}

interface AppConfigDatabase {
    readonly host: string;
    readonly port: number;
    readonly name: string;
    readonly user: string;
    readonly pass: string;
}

interface AppConfigAuthServer {
    readonly url: string;
}

interface AppConfigAws {
    readonly fileS3BucketName: string;
    readonly fileS3BucketRegion: string;
    readonly fileS3BucketIsAccelerated: boolean;
}

export default validatedConfig as AppConfig;
