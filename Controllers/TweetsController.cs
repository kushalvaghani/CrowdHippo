using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CrowdHippo.Controllers
{
    public class TweetsController : ApiController
    {
        [HttpGet]
        public List<Models.Tweet> get()
        {
            try
            {
                CrowdHippoEntities db = new CrowdHippoEntities();
                List<Models.Tweet> tweets = new List<Models.Tweet>();
                //var skip = new Random().Next(db.Tweets.Count());
                //if (skip >= db.Tweets.Count() - 15)
                //    skip = 1;
                //var tList = db.Tweets.OrderBy(x=>x.Id).Skip(skip).Take(15).ToList();
                var tList = new List<Tweet>();
                for (int i = 0; i <= 15; i++)
                    tList.Add(PickTweet(tList));

                //tList = db.Tweets.OrderBy(x => x.Id).Take(15).ToList();
                foreach (Tweet t in tList)
                {
                    Models.Tweet tw = new Models.Tweet()
                    {
                        Id = t.Id,
                        Text = t.Text
                    };
                    tweets.Add(tw);
                }
                return tweets;
            }
            catch (Exception ex)
            {
                var message = ex.Message;
            }
            return null;
        }

        private Tweet PickTweet(List<Tweet> omitList)
        {
            Tweet newPick = null;
            using (CrowdHippoEntities db = new CrowdHippoEntities())
            {
                //
                var notfound = true;
                int counter = 0;
                while (notfound)
                {
                    int id = new Random().Next(db.Tweets.Count());
                    newPick = db.Tweets.ToList().ElementAt(id);
                    if (!omitList.Any(ol => ol.Id == newPick.Id))
                    {
                        if (!newPick.Keywords.Any(k => k.UserKeywordTags.Count() > 0))
                            notfound = false;
                    }
                    //
                    counter++;
                    if (counter == 20)
                        notfound = false;
                }
            }
            //
            return newPick;
        }

        [HttpGet]
        public Models.Tweet get(int id)
        {
            try
            {
                CrowdHippoEntities db = new CrowdHippoEntities();
                var tweet = db.Tweets.Where(t => t.Id == id).FirstOrDefault();
                var tw = new Models.Tweet()
                {
                    Id = tweet.Id,
                    Text = tweet.Text
                };
                return tw;
            }
            catch (Exception ex)
            {
                var message = ex.Message;
            }
            return null;
        }
    }
}
