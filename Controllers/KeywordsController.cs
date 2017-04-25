using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CrowdHippo.Controllers
{
    public class KeywordsController : ApiController
    {
        [HttpGet]
        public Models.Keywords get(int tweetid)
        {
            CrowdHippoEntities db = new CrowdHippoEntities();
            var keywords = new List<Keyword>();
            //
            keywords = db.Keywords.Where(key => key.TweetId == tweetid).ToList();
            var results = new Models.Keywords();
            foreach(Keyword k in keywords)
            {
                Models.Keyword item = new Models.Keyword();
                item.Id = k.Id;
                item.Name = k.Keyword1;
                item.TagCount = 0;
                //
                switch (k.SourceId)
                {
                    case 1: results.fromText.Add(item);
                        break;
                    case 2:results.fromHashtag.Add(item);
                        break;
                    case 3: results.fromURL.Add(item);
                        break;
                }
            }
            return results;
        }
    }
}
