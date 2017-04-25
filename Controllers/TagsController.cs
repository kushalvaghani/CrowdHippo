using CrowdHippo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CrowdHippo.Controllers
{
    public class TagsController : ApiController
    {
        [HttpGet]
        public List<Models.ViewTag> Get()
        {
            CrowdHippoEntities db = new CrowdHippoEntities();
            var tags = new List<Models.ViewTag>();
            //
            foreach (Tag tag in db.Tags.ToList())
            {
                var viewTag = new ViewTag()
                {
                    Id = tag.Id,
                    Name = tag.Name
                    //
                };
                switch(tag.Id)
                {
                    case 1: viewTag.Color = "Red"; break;
                    case 2: viewTag.Color = "Green"; break;
                    case 3: viewTag.Color = "Blue"; break;
                    case 4: viewTag.Color = "Purple"; break;
                }
                tags.Add(viewTag);
            }
            return tags;
        }
    }
}