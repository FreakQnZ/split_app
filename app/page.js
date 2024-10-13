import React from "react";
import Image from "next/image";
import { TextGenerateEffect } from "./components/ui/text-generate-effect";
import Navbar from "./components/navbar";

const words = "Add bills and split with ease, anywhere";

const Home = () => {
  return (
    <main>
      <Navbar />
      <div className="hero bg-sky-100 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse justify-between w-full">
          <Image
            src="/hero_bg.svg"
            width={700}
            height={700}
            className="max-w-sm p-5 "
            alt="Split App"
          />
          <div>
            {/* <h1 className=" text-7xl font-bold">Add bills and split with <br/> ease, anywhere!</h1> */}
            <TextGenerateEffect duration={2} filter={false} words={words} />
            <p className="py-6 text-xl">
              Securely split bills among friends, ensuring fair payments for
              everyone.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
