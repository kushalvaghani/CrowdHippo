using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CrowdHippo.Models
{
    public class Tweet
    {
        public int Id { get; set; }
        public string Text { get; set; }
    }

    public class Keyword
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public int TagCount { get; set; }
    }

    public class Keywords
    {
        public Keywords()
        {
            fromText = new List<Keyword>();
            fromHashtag = new List<Keyword>();
            fromURL = new List<Keyword>();
        }
        public List<Keyword> fromText { get; set; }
        public List<Keyword> fromHashtag { get; set; }
        public List<Keyword> fromURL { get; set; }
    }

    public class ViewTag
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string Color { get;set;}
    }

    public class KeywordTags
    {
       
        public int KeywordId { get; set; }
        public int TagId { get; set; }
    }
}