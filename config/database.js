if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI:
        'mongodb://Javel:Javel@ds259117.mlab.com:59117/utechsorat-prod'}} else {
            module.exports = {mongoURI: 'mongodb://localhost:27017/sorat-dev'
        }
}