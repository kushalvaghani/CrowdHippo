using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace CrowdHippo.Controllers
{
    public class KeywordTagsController : ApiController
    {
        [HttpPost]
        public void Post(List<Models.KeywordTags> keywordTags)
        {
            using (CrowdHippoEntities db = new CrowdHippoEntities())
            {
                var username = (string)HttpContext.Current.Session["username"];
                var user=  db.AspNetUsers.Where(us => us.UserName == username).FirstOrDefault();
                var existingTags = db.UserKeywordTags.ToList();
                if(user != null)
                {
                    var internalUser = db.Users.Where(us => us.UserId == user.Id).FirstOrDefault();
                    if(internalUser != null)
                    {
                        foreach(Models.KeywordTags kt in keywordTags)
                        {
                            if (!existingTags.Exists(et => et.KeywordId == kt.KeywordId && et.TagId == kt.TagId && et.UserId == internalUser.Id))
                            {
                                UserKeywordTag ukt = new UserKeywordTag()
                                {
                                    KeywordId = kt.KeywordId,
                                    TagId = kt.TagId,
                                    UserId = internalUser.Id
                                };
                                db.UserKeywordTags.Add(ukt);
                            }
                        }
                        db.SaveChanges();
                    }
                }
            }
        }
    }
}
