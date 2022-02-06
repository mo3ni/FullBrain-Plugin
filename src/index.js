/*global chrome*/
import React, { Component } from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./style.css";
import "./header";
import FBExtHeader from "./header";
import LoadingSpinner from "./loading-spinner";
import TagInput from "./tags";
import { db } from "./firebase-config";
import { collection, addDoc } from "firebase/firestore";
import moment from "moment";
//import { async } from '@firebase/util';

class FBApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        url: "",
        title: "",
        tags: "",
        notes: "",
        created_at: "",
        response_code: 0,
      },
      userData: {
        user_id: "",
        // user_email:"",
        // google_user_id: ""
      },
      result: {
        dataMsg: "",
        cssClasses: "d-none",
      },
      access: {
        authUser: false,
        token: "",
      },
    };
    // this.result = {

    // }
    this.dbCon = collection(db, "plug-in");
  }

  componentDidMount() {
    this.authUser();
    this.getUrl();
    this.getUserData();
  }

  /**
   * Authenticate user in app starr up. check for the token, if token not found then login with google account.
   **/
  authUser() {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (token) {
        this.setState({
          access: {
            authUser: true,
            token: token,
          },
        });
      }
    });
  }

  /**
   *  Get  active tab URL and title info and update the state
   */
  getUrl() {
    chrome.runtime.sendMessage({ message: "sendMeURL" }, (response) => {
      if (response.webInfo) {
        var res = JSON.parse(response.webInfo);
        console.log(res);
        this.setState({
          data: {
            url: res.url,
            title: res.title,
            response_code: 200,
          },
        });
      } else {
        this.setState({
          data: { statusCode: 404 },
        });
      }
    });
  }

  getUserData() {
    chrome.runtime.sendMessage(
      {
        message: "sendUserData",
      },
      (response) => {
        if (response.getUserData) {
          var resp = JSON.parse(response.getUserData);
          console.log(resp.value);
          this.setState({
            userData: {
              user_id: resp.value,
              // google_user_id: googleUserID,
              // email: email,
            },
          });
        }
        console.log(this.state);
      }
    );
  }

  save = () => {
    var tags = this.getTags();
    this.setState(
      {
        data: {
          url: this.state.data.url,
          title: this.state.data.title,
          user_id: this.state.userData.user_id,
          // user_email: this.state.userData.user_email,
          // google_user_id: this.state.userData.google_user_id,
          response_code: this.state.data.response_code,
          notes: document.getElementById("notes").value,
          tags: tags.join(", "),
          created_at: moment().format("DD-MM-YYYY h:mm:ss"),
        },
      },
      () => {
        this.saveToFirestore();

        console.log(this.state);
      }
    );
  };

  getTags() {
    var tagsElements = document.getElementsByClassName("tagComponent__text");
    let tags = [];
    for (var i = 0; i < tagsElements.length; i++) {
      tags[i] = tagsElements[i].innerText;
    }
    return tags;
  }

  saveToFirestore = async () => {
    this.setState({
      result: {
        dataMsg: <LoadingSpinner />,
        cssClasses: "d-block text-center",
      },
    });
    try {
      const docRef = await addDoc(this.dbCon, this.state.data);
      this.setState({
        result: {
          dataMsg: "Data added",
          cssClasses: "alert-success p-2",
        },
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
      this.setState({
        result: {
          dataMsg: "Failed to add data.",
          cssClasses: "alert-danger p-2",
        },
      });
    }
    setTimeout(() => {
      this.setState({
        result: {
          dataMsg: "",
          cssClasses: "d-none",
        },
      });
    }, 10000);
  };

  render() {
    if (this.state.access.authUser === false) {
      return (
        <div className="container d-flex justify-content-center align-items-center text-center h-100">
          <LoadingSpinner />

          {/* <span>Please wait while Authenticating</span> */}
        </div>
      );
    } else {
      return (
        <div className="container main-container py-2 bg-color">
          <FBExtHeader />

          <div className="divider"></div>

          <div className="main-container">
            <div className="card border-0 bg-color">
              <div className="card-body">
                <div className="url mb-3">
                  <h5 id="url-title"> {this.state.data.title}</h5>
                </div>

                <div className="mb-3">
                  <textarea
                    rows="4"
                    placeholder="Add notes"
                    id="notes"
                    className="form-control shadow border-radius"
                  ></textarea>
                </div>
                <div className="tags mb-3">
                  <TagInput />
                  <div className={this.state.result.cssClasses}>
                    {this.state.result.dataMsg}
                  </div>
                </div>
              </div>

              <div className="footer-container">
                <div className="library d-inline">
                  <img
                    className="img-fluid"
                    src="/images/logo2.svg"
                    alt="Library"
                  ></img>
                  <a href="http://fullbrain.org/" target="_blank">
                    {" "}
                    <span className="fw-bold ">My Library</span>
                  </a>
                </div>

                <div className="float-end">
                  <div className="direct-share d-inline me-2">
                    <a href="http://fullbrain.org/" target="_blank">
                      <span>Direct share in a course</span>
                    </a>
                  </div>
                  <div className="bookmark d-inline ">
                    <button
                      className="btn btn-sm "
                      onClick={this.save}
                      type="button"
                    >
                      Save to Library
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

ReactDOM.render(<FBApp />, document.getElementById("app-root"));
