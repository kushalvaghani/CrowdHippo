using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace CrowdHippo.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        //[RequireHttps]
        [Authorize]
        public ActionResult Index()
        {
            Session["username"] = User.Identity.GetUserName();
            ViewBag.Error = Session["Message"];
            return View();
        }
    }
}
