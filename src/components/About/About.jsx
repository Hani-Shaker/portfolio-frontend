import './About.css'
import about from "../../assets/images/about.png";

function About() {

  return (
    <section id="about">
      <div className="cont-about p-10 flex">
        <div className="who-me flex gap-10 justify-center items-center">
          <div className="left-who-me w-80 relative">
            <img src={about} alt="" />
          </div>
          <div className="right-who-me w-1/2 flex flex-col gap-5">
            <h6 className="text-4xl font-black">About Me</h6>
            <span className='font-bold'>
              I'm <h6>Hani Shaker</h6> I am a highly motivated <h6>Full-stack</h6> Web Developer and a Computer Science student at Fayoum University,
              Faculty of Science. Currently 20 years old, my academic foundation is strongly complemented by practical skills in <h6>modern web development</h6>.
              I have successfully completed comprehensive web development courses and earned certified credentials that validate my expertise.
              My studies have provided me with a solid understanding of the theoretical underpinnings of computer science.
              I have developed numerous comprehensive projects across various domains.
              Crucially, I have extensive experience collaborating with teams on shared projects, 
              allowing me to become highly skilled and proficient in teamwork and agile development methodologies. 
              I thrive in environments where effective communication and joint problem-solving lead to successful project delivery.
              </span>
          </div>
        </div>
        <div className="courses"></div>
        <div className="resume"></div>
        <div className="ambitions"></div>
      </div>

    </section>
  )
}

export default About
