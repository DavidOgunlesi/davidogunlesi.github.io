import AsciiHRule from '../AsciiHRule';
import './styles.css';

export function Navbar(){
    
return (

    <div className="navbar_container">
        {/* <div className='hr dotted'/> */}
        <div className="navbar">
            {/* <NavLink  link='' text='#Sandbox'/>   */}
            <NavLink  link='https://www.linkedin.com/in/david-ogunlesi-b96b31182/' text='#LinkedIn'/>  
            <NavLink  link='https://github.com/DavidOgunlesi' text='#My Github'/>  
            <NavLink  link='/files/Resume.pdf' text='#My Resume'/>  
            <NavLink  link='' text='#Projects'/>  
            <NavLink  link='' text='#About-me'/>
            <NavLink  link='' text='#Papers'/>  
            <NavLink  link='' text='#Contact'/>  
            {/* <NavLink  link='' text='#Design-Portfolio'/>   */}
            
        </div>
    </div>
    );
}

function NavLink({link, text}) {
    const makeEl = () => {
        if (link){
           return <a href={link}>{text}</a>
        }else{
            return text
        }
    }
  return (
      <div className="navbar_text"
      onClick={() => {
        let elementY = document.getElementById(text).getBoundingClientRect().top + window.pageYOffset;
        console.log(elementY);
        doScrolling(elementY, 500);
        console.log(document.getElementById(text));
    }}
      >
        {makeEl()}
      </div>
      );
}

function doScrolling(elementY, duration) { 
    var startingY = window.pageYOffset;
    var diff = elementY - startingY;
    var start;
  
    // Bootstrap our animation - it will get called right before next frame shall be rendered.
    window.requestAnimationFrame(function step(timestamp) {
      if (!start) start = timestamp;
      // Elapsed milliseconds since start of scrolling.
      var time = timestamp - start;
      // Get percent of completion in range [0, 1].
      var percent = Math.min(time / duration, 1);
  
      window.scrollTo(0, startingY + diff * percent);
  
      // Proceed with animation as long as we wanted it to.
      if (time < duration) {
        window.requestAnimationFrame(step);
      }
    })
  }