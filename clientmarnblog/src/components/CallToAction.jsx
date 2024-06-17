import { Button } from "flowbite-react";
import React from "react";

const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-bl-3xl rounded-tl-none rounded-tr-3xl rounded-br-none text-center">
      <div className="flex-1 p-7 flex flex-col gap-2 justify-center ">
        <h2 className="text-2xl font-semibold">
          Want to Learn more about JavaScript
        </h2>
        <p className="text-gray-500 my-2">
          Checkout these resources with 100 JavaScript Projects
        </p>
        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none rounded-br-xl rounded-tr-none"
        >
          <a
            href="https://www.100jsprojects.com"
            target="_blank"
            rel="noopenner noreferrer"
          >
            100 JavaScript Projects
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          src="https://wpengine.com/wp-content/uploads/2021/07/jsheader.png"
          alt=""
        />
      </div>
    </div>
  );
};

export default CallToAction;
