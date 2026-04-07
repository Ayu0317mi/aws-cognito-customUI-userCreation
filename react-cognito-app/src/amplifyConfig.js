import { Amplify } from "aws-amplify";

Amplify.configure({
    Auth: {
        Cognito: {
            region: import.meta.env.VITE_COGNITO_REGION,
            userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
            userPoolWebClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
        },
    },
});