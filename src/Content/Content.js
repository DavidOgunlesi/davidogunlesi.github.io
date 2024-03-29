import AsciiHRule from '../Components/AsciiHRule';
import './styles.css';
import AsciiCarousel from '../Components/AsciiCarousel';
import Markdown from 'react-markdown'
import { useEffect, useState } from 'react';

export function Content(){
    const [update, setUpdate] = useState(false);
    const [files, setFiles] = useState([]);
    const [activeTags, setActiveTags] = useState([]);
    const [activeRole, setActiveRole] = useState("Anything");
    const [currReadMore, setCurrReadMore] = useState(null);

    const addRemoveTag = (tag) => {
        if (activeTags.includes(tag)) {
            var index = activeTags.indexOf(tag);
            activeTags.splice(index, 1);
            setActiveTags(activeTags);
            console.log(activeTags);
            return;
        }
        activeTags.push(tag);
        setActiveTags(activeTags);
        console.log(activeTags);
    }

    const get_text_file = async (filepath) => {
        // prefix public dir files with `process.env.PUBLIC_URL`
        // see https://create-react-app.dev/docs/using-the-public-folder/
        const res = await fetch(`${process.env.PUBLIC_URL}/${filepath}`);
        // check for errors
        if (!res.ok) {
          throw res;
        }
        return res.text();
      };

    const filePaths = require.context('../../public/markdown/projects', true, /\.md$/).keys();
    useEffect(() => {
        var newFiles = [];
        filePaths.map(file => {
            get_text_file(`markdown/projects${file.slice(1)}`).then((text)=>{
                if (newFiles.includes(text)) return;
                newFiles.push(text);
                setFiles(newFiles);
            }).catch(console.error);
            });
      }, []);

      const hasProperty = (text, property) => {
        text = text.split('--?');
        text = text.slice(1, text.length-1);
        var text = text[0].split('\n');
        var fitered = text.filter((line) => {
            return line.includes(property);
        });
        if  (fitered.length == 0) return false;

        return true;
      }

      const getProperty = (text, property, replace = true) => {
        text = text.split('--?');
        text = text.slice(1, text.length-1);
        var text = text[0].split('\n');
        var fitered = text.filter((line) => {
            return line.includes(property);
        });
        var prop = fitered[0] ?? '';
        var final = prop.split(':')[1].trim();

        if (replace) {
            final = final.replaceAll('"', '');
        }
        
        return final;
      };

      const getContent = (text) => {
        text = text.split('--?');
        return text[text.length-1];
      };

      const createTags = () => {
        const tagGroups = {};
        files.map((file) => {
            var tags = JSON.parse(getProperty(file, 'tags', false));
            tags.map((tag) => {
                if (tagGroups[tag]) {
                    tagGroups[tag].count = tagGroups[tag].count += 1;
                }else{
                    tagGroups[tag] = {label: tag, count: 1}
                }
            });
        })
        
        var elements = []
        Object.keys(tagGroups).forEach(function(key, index) {
            elements.push(
                <div className={activeTags.includes(key) ? 'filter active' : 'filter'} key={index} onPointerDown={() => 
                {
                    // setActiveTag(key)
                    addRemoveTag(key);
                    setUpdate(!update);
                    setActiveRole("Anything");
                }}>
                    <div className='label'>#{tagGroups[key].label}</div>
                    <div className='number'>{tagGroups[key].count}</div>
                </div>
            );
        });
        return elements;
      }

      const createLanguageTags = (file) => {
        var elements = []
        if (!hasProperty(file, 'languages')) return elements;

        var tags = JSON.parse(getProperty(file, 'languages', false));
        for (let index = 0; index < tags.length; index++) {
            const element = tags[index];
            elements.push(
                <div className='filter' key={index} style={{margin: 4, height: 7}}>
                    <div className='label'>{element}</div>
                </div>
            );
        }
        
        return elements;
      }

      function findCommonElement(array1, array2) { 
  
        // Loop for array1 
        for (let i = 0; i < array1.length; i++) { 
      
            // Loop for array2 
            for (let j = 0; j < array2.length; j++) { 
      
                // Compare the element of each and 
                // every element from both of the 
                // arrays 
                if (array1[i] === array2[j]) { 
      
                    // Return if common element found 
                    return true; 
                } 
            } 
        } 
      
        // Return if no common element exist 
        return false; 
    } 

    const RudimentaryDateToNumber = (date) => {
        var dateArr = date.split(' ');
        var monthStr = dateArr[0].toLowerCase();
        var yearInt = parseInt(dateArr[1].toLowerCase());
        var monthInt = 0;
        switch (monthStr) {
            case 'january':
                monthInt = 1;
                break;
            case 'february':
                monthInt = 2;
                break;
            case 'march':
                monthInt = 3;
                break;
            case 'april':
                monthInt = 4;
                break;
            case 'may':
                monthInt = 5;
                break;
            case 'june':
                monthInt = 6;
                break;
            case 'july':
                monthInt = 7;
                break;
            case 'august':
                monthInt = 8;
                break;
            case 'september':
                monthInt = 9;
                break;
            case 'october':
                monthInt = 10;
                break;
            case 'november':
                monthInt = 11;
                break;
            case 'december':
                monthInt = 12;
                break;
            default:
                monthInt = 1;
                break;
        }
        if (date.toLowerCase().includes('present')) {
            monthInt = 12;
            yearInt = 3000;
        }
        return yearInt*100 + monthInt;

    };


      const displayProjects = (activeTags) => {
        var elements = []
        files.sort((a, b) => {
            var dateA = RudimentaryDateToNumber(getProperty(a, 'date'));
            var dateB = RudimentaryDateToNumber(getProperty(b, 'date'));
            return dateB - dateA;
        });

        files.map((file, index) => {
            var title = getProperty(file, 'title');
            var tags = JSON.parse(getProperty(file, 'tags', false));
            var desc = getProperty(file, 'description');
            var date = getProperty(file, 'date');
            var image = getProperty(file, 'image');
            image = image.replaceAll('"', '');
            /*get image*/
            if (findCommonElement(tags, activeTags)) {
                elements.push(
                    <div className='project_display' key={title}>
                        <div className='wipe'></div>
                        <div className='info'>
                            <div className='project_title'>{title}</div>
                            <div className='tags'>{tags.join(", ")}</div>
                            <div className='description'>{desc}</div>
                            <div className='date'>{date}</div>
                            <div className='horizontal_container'>{createLanguageTags(file)}</div>
                            <div className='readmore' onPointerDown={() => setCurrReadMore(file)}>Read More</div>
                        </div>
                        <div className='img-holder'><img src={image}/></div>
                        
                    </div>
                );
            }
        });
        return (<div className='vertical_container' style={{gap: 50}}>{elements}</div>);
      }

      const displayReadMoreWindow = () => {

        if (currReadMore == null) return;

        var file = currReadMore;
        var title = getProperty(file, 'title');
        var tags = JSON.parse(getProperty(file, 'tags', false));
        var desc = getProperty(file, 'description');
        var date = getProperty(file, 'date');
        var image = getProperty(file, 'image');
        var content = getContent(file);
        image = image.replaceAll('"', '');

        return (
            <div className='readmoreWindow'>
                <div className='close' onPointerDown={() => setCurrReadMore(null)}>Close</div>
                <div className='project_display' key={title}>
                    <div className='info'>
                        <div className='project_title'>{title}</div>
                        <div className='tags'>{tags.join(", ")}</div>
                        <div className='description'>{desc}</div>
                        <div className='date'>{date}</div>
                        <div className='horizontal_container'>{createLanguageTags(file)}</div>
                        
                        <Markdown>{content}</Markdown>
                    </div>
                    <div className='img-holder'><img src={image}/></div>
                </div>
                {/* <div className='project_content' key={title}>
                    {content}
                </div> */}
            </div>
        );
    }

    return (
        <div>
            {/* <div className="content_container" id="#Sandbox">  
                <Heading text="Sandbox"/>
                <div className='horizontal_container'>
                    <AsciiCarousel images={[
                    {caption: "Heart", imageURL: '/heart.jpg'}, 
                    {caption: "Atom", imageURL:'/logo192.png'},
                    ]}/>
                    <div className='text_right' style={{textAlign: "right"}}>
                        <p>Images speak a thousand words, interactive projects then...</p>
                        <p>...speak a million.</p>
                        <p>Most people are visual learners and most visualisations are
                            better than text. I'm a visual learner and an artist at heart
                            and I love to make visualisations. I'm also a developer and I 
                            love to make interactive visualisations. Play around with some 
                            with some of my sandbox projects at your own risk. They're
                            not always stable and they're not always pretty. But they're
                            always fun. 
                        </p>
                    </div>
                </div>
            </div> */}
            {/* <Markdown>{file}</Markdown> */}
            <div className="content_container" id="#Hire">  
                <Heading text="10 reasons Why should you hire me" style={{textAlign:"left"}}/>
                <div className='filter_container left wrap'>
                    <div className='filter active'>
                        <div className='label'>#1 I Write Code Every Single Day</div>
                    </div>
                    <div className='filter active'>
                        <div className='label'>#2 I am a Dedicated Game Developer with Graphic Design Skills</div>
                    </div>
                    <div className='filter active'>
                    <div className='label'>#3 I am Crafting a Commercial-Ready Game at the Scale of RimWorld</div>
                    </div>
                    <div className='filter active'>
                        <div className='label'>#4 I have Experience Architecting Large Codebases</div>
                    </div>
                    <div className='filter active'>
                        <div className='label'>#5 I have Proven Track Record of Meeting Deadlines</div>
                    </div>
                    <div className='filter active'>
                        <div className='label'>#6 I have Strong Analytical and Debugging Skills</div>
                    </div>
                    <div className='filter active'>
                        <div className='label'>#7 Well-versed in Software Architecture and Design Patterns</div>
                    </div>
                    <div className='filter active'>
                        <div className='label'>#8 I am not Afraid of Leaving My Comfort Zone</div>
                    </div>
                    <div className='filter active'>
                        <div className='label'>#9 I have Experience Leading Development Teams</div>
                    </div>
                    <div className='filter active'>
                        <div className='label'>#10 I have Strong Artistic Visions, and Actually Attempt to Execute Them</div>
                    </div>
                    <div className='filter active'>
                        <div className='label'>#11  I have Excellent Communication Skills for Effective Team Collaboration</div>
                    </div>
                </div>
                <Heading text="Did I say 10, I meant 11!" style={{textAlign:"left"}} hideRules/>
                
            </div>
            <div className="content_container" id="#Projects">  
                <Heading text="What do you want me to be?" style={{textAlign:"left"}}/>
                
                <div className='filter_container left wrap'>
                    <div className={activeRole == "Anything" ? 'filter active' : 'filter'} onPointerDown={()=> {setActiveTags([]); setActiveRole("Anything");}}>
                        <div className='label'>#Anything</div>
                    </div>
                    <div className={activeRole == "Game Developer" ? 'filter active' : 'filter'} onPointerDown={()=> {setActiveTags(["Gamedev", "Unity", "Computer Graphics"]); setActiveRole("Game Developer");}}>
                        <div className='label'>#Game Developer</div>
                    </div>
                    <div className={activeRole == "Web Developer" ? 'filter active' : 'filter'} onPointerDown={()=> {setActiveTags(["Web Development"]); setActiveRole("Web Developer");}}>
                        <div className='label'>#Web Developer</div>
                    </div>
                    <div className={activeRole == "Programmer" ? 'filter active' : 'filter'} onPointerDown={()=> {setActiveTags(["Simulation", "Uni", "AI", "Computer Graphics"]); setActiveRole("Programmer");}}>
                        <div className='label'>#Programmer</div>
                    </div>
                    <div className={activeRole == "Designer" ? 'filter active' : 'filter'} onPointerDown={()=> {setActiveTags(["Game Design", "Graphic Design"]); setActiveRole("Designer");}}>
                        <div className='label'>#Designer</div>
                    </div>
                </div>
            </div>
            <div className="content_container" id="#Projects">  
                <Heading text="Projects & Experience" hideRules style={{textAlign:"left"}}/>
                <div className='filter_container left wrap'>
                    {createTags()}
                </div>
                {activeTags.length == 0 &&
                    <div className='horizontal_container'>
                        <div className='text_left'>
                            <p>
                            I start a lot of projects. If every artist has a thousand bad drawings before they can draw a good one, then maybe I'm on track to hit gold. I'm not sure if that's true, but I'm sure that I have a lot of bad projects. I'm also sure that I have a lot of good projects. Though understandably many of these lie somewhere in between; in the realm of the mediocre and the unfinished.
                            </p>
                            <p> Let's stick to the good projects.</p>

                            <p> This is supposed to be portfolio afterall... (ಠ_ಠ)</p>
                        </div>
                        <AsciiCarousel images={[
                        {caption: "Heart", imageURL: '/heart.jpg'}, 
                        {caption: "Atom", imageURL:'/logo192.png'},
                        ]}/>
                    </div>
                }
                {
                    activeTags.length != 0 && displayProjects(activeTags)
                }
                
            </div>
            
            {displayReadMoreWindow()}
            
            <div className="content_container" id="#Languages">  
                <Heading text="My Strongest Languages & Skills" style={{textAlign:"left"}}/>
                
                <div className='filter_container left wrap'>
                    <div className='filter active'>
                        <div className='label'>C# (4 years)</div>
                    </div>
                    <div className='filter active'>
                        <div className='label'>UnityEngine (4 years)</div>
                    </div>
                    <div className='filter active'>
                        <div className='label'>Javascript (5 years)</div>
                    </div>
                    <div className='filter active'>
                        <div className='label'>Python (6 years)</div>
                    </div>
                    <div className='filter active'>
                        <div className='label'>C++ (Just Started)</div>
                    </div>
                    
                </div>
            </div>

            <div className="content_container">  
                <Heading text="Projects I Want to Make" style={{textAlign:"center"}}/>
                <p>There is a backlog of projects that I want to make. Some of them are cool! So here's a list of them.</p>

                <div className='vertical_container' >

                    <ul  style={{textAlign: "left"}}>
                        <li>A Webserial hosting Website called SerialBox</li>
                        <li>A Wartime Cryptography Game with Deep Moral Choices</li>
                        <li>A Graph Algorithm Visualisation Web App</li>
                        <li>Internet Routing Visualisation Web App</li>
                        <li>Rocket Engine Bell Simulator and EA Optimisation</li>
                        <li>Javascript Mario Platformer</li>
                        <li>Machine Learning Online Tool</li>
                        <li>Boids Swarm using Three.js</li>
                        <li>Doom Opengl C++ Recreation</li>
                        <li>C++ Game Engine</li>
                        <li>C++ Voxel Engine</li>
                        <li>Dwarf Fortress inspired game about Tree-dwarfs</li>
                    </ul>
                </div>  
            </div>
            
            <div className="content_double_container">
                <div className="content_container" id="#About-me">  
                    <Heading text="About me" style={{textAlign:"left"}}/>
                    <div className='vertical_container'>
                        <div className='text_middle' style={{textAlign: "left"}}>
                            <p>
                            Hey, I'm David – in case you missed the memo. Step into my about-me zone, where we talk about me. How exciting. I wear many hats – developer, designer, writer, avid reader, perpetual thinker, eternal dreamer, and a doer when I'm not not doing that. Which is never. I'm always doing something.
                            </p>
                            <div className='hr dashed'/>
                            <p>
                            Jokes aside, I would describe myself as an artistic-minded programmer. 
                            I use programming as a tool to create art.
                            </p>
                            <p>
                            I'm not a programmer who
                            creates art. I'm an artist who uses programming as a tool to create art. Whether that art is software, music, or writing, I'm always trying to create something beautiful.
                            </p>
                            <p>But I'm still a goddamn good programmer.</p>
                            <div className='hr dashed'/>
                            <p>My favourite topics are: </p>
                            <ul>
                                <li>Computer Vision</li>
                                <li>Computer Graphics</li>
                                <li>Mathematics</li>
                                <li>Physics</li>
                                <li>Music</li>
                                <li>Art</li>
                                <li>Science Fiction</li>
                                <li>History</li>
                                <li>Philosophy</li>
                                <li>Psychology</li>
                            </ul>
                            <div className='hr dashed'/>
                            <p>My favourite books are: </p>
                            <ul>
                                <li>1984</li>
                                <li>Dune</li>
                            </ul>
                            <div className='hr dashed'/>
                            <p>My hobbies include: </p>
                            <ul>
                                <li>Game Developing</li>
                                <li>Writing</li>
                                <li>Programming (a given)</li>
                                <li>Gaming</li>
                                <li>Anime</li>
                                <li>Making awesome portfolios</li>
                                {/* <li>Sleeping</li> */}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="content_container" id="#Papers">  
                    <Heading text="Papers & Blogs" style={{textAlign:"right"}} />
                    <div className='vertical_container'>
                        <div className='text_right'>
                            
                                {/* The beauty of being a developer is that you can make anything.
                                The beauty of being a university student is that you can't make anything.
                                The beauty of being a university student is that you can write about anything. */}
                                <p>The beauty of being a university student is that you occasionally get to write about anything.</p>
                                <p>The beauty of being a developer is that you can make anything.</p>
                                <p>The two go in hand in hand. I love to write about what I make and I love to make what I write about.</p>
                                <p>So here are some of my writings. Written by yours truly.</p>
                        
                        <div className="emphasis"> <a href="https://plasmarcstudios.co.uk/containcorp-blog/">Containcorp Development Blog</a></div>
                        <div className="emphasis"> <a href="/files/DissY4Review.pdf">Presenting a Novel Transformer Architecture for GPT-driven NPCs to
Mimic Human-Likeness and Autonomy in a Video Game Context</a></div>
                        <div className="emphasis"> <a href="/files/Dissertation1.pdf">Generating Artificial Societies Dissertation</a></div>
                        <div className="emphasis"> <a href="/files/GJKAlgorithm.pdf">GJK Shape Intersection Algorithm Literature Review</a></div>
                        <div className="emphasis"> <a href="/files/AIbasedMinorityReport.pdf">Are We Ready For An AI-based Minority Report?</a></div>
                        </div>
                    </div>


                    <div style={{marginTop: 30}}  id="#Contact"></div>
                    <Heading text="Contact" style={{textAlign:"right"}}/>
                    <div className='vertical_container'>
                        <div className='text_right'>
                            <p>Want to get in touch? </p>
                            <p>Send me an email at <a href="mailto: david.ogunlesi@yahoo.co.uk"/>david.ogunlesi@yahoo.co.uk</p>
                            <p>Or connect with me on <div className="emphasis"><a href="https://www.linkedin.com/in/david-ogunlesi-b96b31182/">LinkedIn</a></div></p>
                        </div>
                    </div>
                </div>
                {/* <div className="content_container" id="#Contact">  
                    <Heading text="Contact" style={{textAlign:"right"}}/>
                    <div className='vertical_container'>
                        <div className='text_middle'>
                            
                        
                        </div>
                        <div className="emphasis"> <a href="/files/Dissertation1.pdf">Generating Artificial Societies</a></div>
                    </div>
                </div> */}
        </div>
    </div>
        
    );
}

function Heading({text, hideRules, style = {}}){
    return (
        <>
            {!hideRules && <div className='hr dashed'/>}
            <div className="title" style={style}>
                <h1><span className="name">{text}</span></h1>
            </div>
            {!hideRules && <div className='hr dotted'/>}
        </>
    );
}
