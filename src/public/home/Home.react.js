import React, {Component} from "react";

import "../../App.css";
import TextSection from "./TextSection.react.js";
import Navbar from "../common/Navbar.react.js";

class Home extends Component {
  render() {
    let logisticsText = (
      <div>
        <p>
          <a href="/rsvp">RSVP</a> - look for the RSVP code on the small card
          included with your invitation
        </p>
        <p>Date: June 9, 2018</p>
        <p>Time: 5:30pm - 10pm</p>
        <p>Location: Barn Kestrel in West Linn, Oregon</p>
        <p>
          Hotel block: The Grand Hotel at Bridgeport in Tigard, OR - 6 miles
          from the venue<br/>
          <br/>
          Call (503) 968-5757 and ask for the Keller/Graham wedding
        </p>
        <p>
          Transportation: A bus will depart from the hotel at 5pm and return from the venue at 10pm
        </p>
      </div>
    );

    let wineTourText = (
      <div>
        <p>Date: Friday June 8, 2018</p>
        <p>Time: 1pm - 6pm</p>
        <p>Tour starts and ends at the Grand Hotel in Bridgeport</p>
        <p><b>Registration is only guaranteed prior to June 2</b></p>
        <p>
          Amara's parents have graciously arranged a professional tour of the beautiful Beacon
          Hill and Colene Clemons wineries. The tour will include transportation, wine tastings,
          and food to pair with the wine. All tour costs will be covered for wedding guests.
        </p>
        <p>
          Please only register if you intend to participate as the fees are non-refundable.
          The tour is 21+, no exceptions.
        </p>
        <p>
          Please register by sending an email to Amara's father, Ronnie Keller, at<span> </span>
          <a href="mailto:ronnie.keller50@gmail.com">Ronnie.Keller50@gmail.com</a>
        </p>
      </div>
    );

    let registryText = (
      <div>
        <p>
          Don't feel obligated to get us anything, your presence is what we're
          really after!
        </p>
        <p>
          <strong>
            Please ship any physical gifts as we don't live in Oregon
          </strong>
        </p>
        <p>Our current address is:</p>
        <p className="indented-text">
          5708 W Parmer Lane APT 4302<br/>
          Austin, TX 78727
        </p>
        <p>
          If you aren't adequately dissuaded take a look at our{" "}
          <a href="https://www.zola.com/registry/akandjj">online registry</a> or
          consider donating to{" "}
          <a href="http://www.ninelivesfoundation.org/">a cause</a> that's close
          to our hearts
        </p>
      </div>
    );

    let storyText = (
      <div>
        <p>
          In the spring of 2014 Amara and JJ were both working for Intel in
          Hillsboro, Oregon. Amara held a volunteer position in the on-boarding
          of recent college graduates and therefore had access to corporate
          tools that most employees did not. Since her desk was located in one
          of Intel's small facilities outside of the main campuses Amara decided
          one day to find all of the people in the building that had graduated
          from college within the last 2 years and invite them to lunch. Her
          investigation yielded three names aside from her own, Valjean who she
          was already friends with and two strangers - Glen and JJ. Amara
          quickly drafted up an email and invited the group to lunch at a Pizza
          Schmitza down the street the following Friday for lunch. Everyone
          accepted and Amara took solace in the fact that even if Glen and JJ
          were weird Valjean would be there and it wouldn't be a complete loss.
          <br/>
          <br/>
          By the time Friday rolled around Valjean had to bail due to work
          obligations and Amara couldn't come up with a good enough excuse to
          bow out herself. Amara, Glen, and JJ ended up sharing pretty decent
          pizza and generally having a good time, enough so that JJ invited
          Amara to come to a local sports bar with them that evening to watch
          the Blazers game. They started texting that evening and simply never
          stopped.
          <br/>
          <br/>
          Later that summer Amara bought a house nearby and about a year later
          she invited JJ to move in. In the fall of 2016 Amara and JJ packed
          everything up and sold the house to move down to the San Francisco Bay
          Area to accept a job offer that Facebook had extended to JJ. Amara was
          able to retain her job at Intel and by transferring down to the Santa
          Clara office which made the decision much easier. After another nine
          months at Intel Amara accepted a job offer from IBM out of San
          Francisco, starting just days after getting engaged in Cabo San Lucas
          on July 2, 2017.
          <br/>
          <br/>
          In their time together Amara and JJ have found shared joy in cooking
          together, farmer's markets, travelling, technology, breakfast
          burritos, friends, family, Amazon Prime, and their 5 year old cat
          Noodles who they adopted in January of 2017. They are both very
          excited to continue their lives together and celebrate their marriage
          with all of you.
        </p>
      </div>
    );

    let faqText = (
      <div>
        <p>
          <strong>What's the dress code?</strong>
          <br/>
          Casual but please no jeans or shorts
        </p>
        <p>
          <strong>What are your colors?</strong>
          <br/>
          White, blue, and light gray (#ffffff, #5388cd, and #f5f5f5,
          respectively)
        </p>
        <p>
          <strong>What are we eating?</strong>
          <br/>
          Two local food trucks will be catering for us - PDX Sliders will
          provide a dinner of sliders, salad, and fries while Momo's Hawaiian
          Grill will supply shaved ice for dessert
        </p>
        <p>
          <strong>Will we be outdoors?</strong>
          <br/>
          If the weather cooperates the ceremony will happen outdoors and the
          reception will be in the barn, if it's raining the ceremony will take
          place in the barn<br/>
          <br/>
          Please note that regardless of weather it's likely you'll have to walk
          on unpaved ground at some point during the evening, plan shoes
          accordingly
        </p>
        <p>
          <strong>Is the barn heated?</strong>
          <br/>
          No, please take the forecast into account prior to foregoing a jacket
        </p>
        <p>
          <strong>Will there be adult beverages?</strong>
          <br/>
          Beer, wine, and spirits will be served
        </p>
        <p>
          <strong>Is there enough parking?</strong>
          <br/>
          There is plenty of parking and the owner of the property will help
          direct you from horseback
        </p>
        <p>
          <strong>Will there be dancing?</strong>
          <br/>
          We sure hope so, the DJ will probably get sad if everyone abstains
        </p>
        <p>
          <strong>Can we dance all night long?</strong>
          <br/>
          Unfortunately no, local ordinances will bring our evening to a close
          at 10pm sharp
        </p>
        <p>
          <strong>I have a question you didn't answer here</strong>
          <br/>
          <a href="mailto:thetwoj@gmail.com,amara.kay.keller@gmail.com">
            Email us
          </a>, we're pretty nice
        </p>
        <p/>
      </div>
    );

    return (
      <div className="App">
        <Navbar/>

        <div id="home">
          <div className="view intro blue-bg">
            <div className="flex-center">
              <div className="white-text transparent-gray-bg">
                <h1 className="title">We're getting married!</h1>
                <p className="subtitle">
                  It's time to{" "}
                  <a href="/rsvp" className="rsvpLink">
                    RSVP
                  </a>{" "}
                  - look for the RSVP code on the small card included with your
                  invitation
                </p>
              </div>
            </div>
          </div>
        </div>

        <TextSection
          title="Logistics"
          text={logisticsText}
          classes="content-block"
        />
        <TextSection
          title="Wine Tour"
          text={wineTourText}
          classes="content-block gray-bg"
        />
        <TextSection
          title="Registry"
          text={registryText}
          classes="content-block"
        />
        <div className="pic-break"/>
        <TextSection
          title="Our Story"
          text={storyText}
          classes="content-block"
        />
        <TextSection
          title="FAQ"
          text={faqText}
          classes="content-block gray-bg"
        />
        <div className="noodles-break"/>
      </div>
    );
  }
}

export default Home;
