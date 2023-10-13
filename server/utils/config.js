require('dotenv').config()

const mongodb_url = process.env.MONGODB_URL 

const node_env = process.env.NODE_ENV





const port = process.env.PORT

const geocoder_provider = process.env.GEOCODER_PROVIDER

const geocoder_api_key = process.env.GEOCODER_API_KEY

const jwt_secret = process.env.JWT_SECRET

const jwt_expire = process.env.JWT_EXPIRE

const jwt_cookie_expire = process.env.JWT_COOKIE_EXPIRE

const max_file_upload = process.env.MAX_FILE_UPLOAD

const file_upload_path = process.env.FILE_UPLOAD_PATH



module.exports = {
    mongodb_url,
    node_env,
    port,
    geocoder_provider,
    geocoder_api_key,
    jwt_secret,
    jwt_expire,
    jwt_cookie_expire,
    max_file_upload,
    file_upload_path
}
