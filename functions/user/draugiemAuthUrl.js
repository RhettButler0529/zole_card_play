const appKey = '61ee303f304374a30309696a27719224';
const appId = '15002077';

const draugiemAuthUrl = (req, res) => {
  const md5 = require('md5');
  const cors = require('cors')({ origin: true });

  cors(req, res, () => {

    const { redirectUrl } = req.body.data;

    if(redirectUrl){
        const hash = md5(`${appKey}${redirectUrl}`);
        const url = `https://api.draugiem.lv/authorize/?app=${appId}&hash=${hash}&redirect=${redirectUrl}`;
        return res.status(200).send({data: { url: url }});
    }else{
        return res.status(400).send({data: { message: `redirectUrl is missing in the request` }});
    }
  });
};

module.exports = draugiemAuthUrl;
