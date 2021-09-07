module.exports = {
    apps: [
        {
            name: "scanify",
            script: "main.js",
            error_file: "./logs/error.log",
            out_file: "./logs/info.log",
            combine_logs: true,
            log_date_format: "YYYY-MM-DD HH:mm Z"
        }
    ]
}