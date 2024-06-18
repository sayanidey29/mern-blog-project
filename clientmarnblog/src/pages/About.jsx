import React from "react";

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="text-center max-w-2xl mx-auto p-3 ">
        <div>
          <h1 className="text-3xl font-semibold text-center my-7">
            Sayani's Blog
          </h1>
          <div className="text-md text-gray-500 flex flex-col gap-6">
            <p>
              Sayani's will provide you good material.Want to turn your blog
              into a business that thrives? You’re in the right place. Blogging
              has always required a diverse set of skills.
            </p>
            <p>
              But in today’s competitive landscape we have to adapt to the
              reality that blogging is about more than just writing & publishing
              blog posts.
            </p>
            <p>
              One minute you’re a social media manager, the next you’re building
              an ecommerce store so your readers can buy merch. Then, you’re
              building a sales funnel that allows you to sell products while you
              sleep. Then there’s filming and editing videos, etc. That’s a lot.
              🤯
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
