import './Contact.css'
import emailjs from 'emailjs-com';


function Contact() {
const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_v3ynvgh",
        "template_akkn1vq",
        e.target,
        "t9UhxicB6D5onL2TJ" 
      )
      .then(
        (result) => {
          console.log(result.text);
          alert("✅ تم إرسال الرسالة بنجاح!");
        },
        (error) => {
          console.log(error.text);
          alert("❌ حدث خطأ أثناء الإرسال، حاول مرة تانية.");
        }
      );
    e.target.reset(); // يفضي الحقول بعد الإرسال
  };
  return (
    <section className="" id='contact'>
      <div className="contact-cont relative">
        <h2 className='font-bold text-3xl p-5 rounded-e-4xl'>Contact With Me</h2>
        <div className="tools-contact">
          <div className="tool">
            <div className="icon"><i className='fas fa-phone'></i></div>
            <span>Phone Number</span> 
            <p>+201118510271</p>                         
          </div>
          <div className="tool">
            <div className="icon"><i className='fas fa-envelope'></i></div>
            <span>Email</span> 
            <p>hanyshaker4123@gmail.com</p>                         
          </div>
          <div className="tool">
            <div className="icon"><i className='fas fa-business-time'></i></div>
            <span>Working Hours</span> 
            <p>Every Day 10 AM : 9 PM</p>                   
          </div>
        </div>
        <div className="message-contact">
          <form onSubmit={sendEmail}>
            <div className="input flex flex-col">
              <label>Name</label>
              <input type="text" name='name' placeholder='Enter your name...' className='gradient-animation' minLength={4} required/>
            </div>
            <div className="input flex flex-col">
              <label>Email</label>
              <input type="email" name='email' placeholder='Enter your Email...' className='gradient-animation' required/>
            </div>
            <div className="input flex flex-col">
              <label>Phone</label>
              <input type="number" name='phone' inputmode="numeric" className='gradient-animation' placeholder='Enter Your Phone Number'/>
            </div>
            <div className="input flex flex-col">
              <label>Subject</label>
              <input type="text" name='subject' placeholder='Ex:Carer...' className='gradient-animation'/>
            </div>
            <div className="input flex flex-col w-full">
              <label>Message</label>
              <textarea name='message' className='block' cols="20" rows="10" placeholder='Write whatever you want...' required></textarea>
            </div>
            <input type='submit' className="submit"></input>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
