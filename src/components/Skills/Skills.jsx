import './Skills.css'

function Skills() {
    const progressSkill = [
    { id: "html", width: "w-[95%]",value:"95%", label: "HTML" },
    { id: "css", width: "w-[90%]",value:"90%", label: "CSS" },
    { id: "js", width: "w-[85%]",value:"85%", label: "JavaScript" },
    { id: "react", width: "w-[80%]",value:"80%", label: "React" },
    { id: "bootstrap", width: "w-[90%]",value:"90%", label: "Bootstrap" },
    { id: "tailwind", width: "w-[95%]",value:"95%", label: "Tailwind" },
    { id: "nodejs", width: "w-[80%]",value:"80%", label: "NodeJs" },
  ];
    const services = [
    { id: "frontend", header: "Front-end Developer",body:"React.js | Vite | Tailwind CSS | JavaScript (ES6+) | HTML5 | CSS3 | Responsive UI | Git & GitHub" },
    { id: "backend", header: "Back-end Developer",body:"Node.js | Express.js | MongoDB | RESTful API | JWT Auth | Mongoose | CRUD Operations" },  ];
  return (
    <section id='skills'>
      <div className="skills-cont w-8/10 h-dvh mx-auto mt-30">
        <div className="achievements flex justify-around font-bold p-10">
          <div className="achievement flex gap-1 items-center">
            <h6 className='text-8xl'>+2</h6>
            <p className='text-2xl'>Years experience</p>
          </div>
          <div className="achievement flex gap-1 items-center">
            <h6 className='text-8xl'>+7</h6>
            <p className='text-2xl'>Projects</p>
          </div>
          <div className="achievement flex gap-1 items-center">
            <h6 className='text-8xl'>+85</h6>
            <p className='text-2xl'>Quality</p>
          </div>
        </div>

        <div className="skills-tools mt-20">
          {progressSkill.map((item) => (
            <div className="tool my-5" key={item.id}>
              <label className='font-bold'>{item.label}</label>
              <div className="back-progress w-full h-2 bg-gray-900 rounded">
                <div className={`progress ${item.width} h-full rounded relative`}>
                  <div className="value-progress absolute">{item.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="services w-full flex gap-5 p-5 justify-center">
          {services.map((item) => (
          <div className="service size-80 rounded-3xl p-10 transition hover:scale-105 " key={item.id}>
            <h3 className='text-3xl'>{item.header}</h3>
            <p>{item.body}</p>
          </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Skills
