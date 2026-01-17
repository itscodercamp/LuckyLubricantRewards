module.exports = {
    apps: [
        {
            name: "lucky-rewards-frontend",
            script: "npx",
            args: "serve -s dist -l 3000",
            interpreter: "none",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
