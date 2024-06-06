import React from "react";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";

const FooterCom = () => {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full m-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-col-1">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Sayani's
              </span>
              Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="ABOUT" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.100jsprojects.com" //external link
                  target="_blank" //open in new window
                  rel="noopener noreferrer"
                >
                  100Js Projects
                </Footer.Link>
                <Footer.Link
                  href="/about" //internal link
                  target="_blank" //open in new window
                  rel="noopener noreferrer"
                >
                  Sayani's Blog About
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="FOLLOW US" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.github.com" //external link
                  target="_blank" //open in new window
                  rel="noopener noreferrer"
                >
                  Github
                </Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="LEGAL" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Condition</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="Sayani's Blog"
            year={new Date().getFullYear()}
          />
        </div>
        <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
          <Footer.Icon href="https://www.facebook.com" icon={BsFacebook} />
          <Footer.Icon href="https://www.instrgram.com" icon={BsInstagram} />
          <Footer.Icon href="https://www.twitter.com" icon={BsTwitter} />
          <Footer.Icon href="https://www.github.com" icon={BsGithub} />
          <Footer.Icon href="https://www.dribble.com" icon={BsDribbble} />
        </div>
      </div>
    </Footer>
  );
};

export default FooterCom;
