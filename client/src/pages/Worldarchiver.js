import React, { useState, Component, useEffect } from "react";
import "../css/Worldarchiver.css";
import { connect } from "react-redux";
import Calendar from "../components/Calendar";
import Button from "../components/Button";
import { setSources, addArticle, clearArticles } from "../actions/index";
import CheckboxGroup from "react-checkbox-group";
import Loader from "../components/Loader";
import { isThisWeek, addDays } from "date-fns";
import { firestore } from "firebase";
import Timeline from "../components/Timeline";
import Collapsible from "react-collapsible";

const mapStateToProps = (state, ownProps) => {
  return {
    startDate: state.startDate,
    endDate: state.endDate,
    calKey: state.calKey,
    articles: state.articles,
    sources: state.sources,
    firebase: ownProps.firebase,
  };
};

function NewsArchiver(props) {
  const [selectedSources, setSelectedSources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(true);

  async function filterSources(sources) {
    // sources = {name, category, url}
    var sourcesToStore = {};
    sources.map(async (s) => {
      if (sourcesToStore[s.category] == null) {
        sourcesToStore[s.category] = [s.name];
        setCategories(categories.push(s.category));
      } else {
        sourcesToStore[s.category].push(s.name);
      }
    });
    return sourcesToStore;
    // setLoading(false);
  }

  useEffect(() => {
    if (props.firebase != null) {
      async function fetchSources() {
        const doc = await props.firebase.db
          .collection("sources")
          .doc("en")
          .get();
        if (doc.exists) {
          var sourcesToStore = await filterSources(doc.data().sources);
          props.dispatch(setSources(sourcesToStore));
          setLoading(false);
        }
      }
      fetchSources();
    }
  }, [props.firebase]);

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function queryDB() {
    props.dispatch(clearArticles());
    var cDate = props.startDate;
    var eDate = props.endDate;
    while (cDate <= eDate) {
      var date = cDate.toISOString().split("T")[0];
      await props.firebase.db
        .collection("headlines")
        .where(firestore.FieldPath.documentId(), "==", date)
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
          }
          snapshot.forEach((doc) => {
            const data = doc.data();
            var keys = Object.keys(data);
            var values = Object.values(data);
            selectedSources.forEach(async (ss) => {
              var index = keys.indexOf(ss);
              if (index != -1) {
                props.dispatch(addArticle(values[index]));
              }
            });
          });
        });
      cDate = addDays(cDate, 1);
    }
  }

  async function onButtonPress() {
    setLoading(true);
    await queryDB();
    // console.log(props.articles);
    setLoading(false);
    setSelecting(false);
  }

  return (
    <div>
      {loading ? (
        <Loader />
      ) : selecting ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            height: "100vh",
            background: "#457B9D",
            overflowX: "hidden",
          }}
        >
          <div
            style={{
              margin: "20px",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                flex: "1",
              }}
            >
              <Calendar
                dispatch={props.dispatch}
                startDate={props.startDate}
                endDate={props.endDate}
                calKey={props.calKey}
              />
            </div>
            <div
              id="cbg"
              style={{
                maxWidth: "30vw",
                maxHeight: "50vh",
                overflowY: "scroll",
              }}
            >
              <CheckboxGroup
                name="sources"
                value={selectedSources}
                onChange={setSelectedSources}
              >
                {(Checkbox) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      maxHeight: "400px",
                      marginLeft: "5px",
                      marginRight: "5px",
                    }}
                  >
                    {/* <label style={{}}>
                      <Checkbox value={"select all"} /> {"Select All"}
                    </label> */}
                    {Object.keys(props.sources).map((key, index) => (
                      <Collapsible
                        triggerClassName="CollapsibleHeader"
                        triggerOpenedClassName="CollapsibleHeader"
                        trigger={key.toUpperCase()}
                      >
                        <div
                          style={{
                            flex: "1",
                            paddingBottom: "10px",
                          }}
                        >
                          <div
                            style={{
                              marginLeft: "20px",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            {props.sources[key].map((name) => (
                              <label style={{}}>
                                <Checkbox value={name} /> {name}
                              </label>
                            ))}
                          </div>
                        </div>
                      </Collapsible>
                    ))}
                  </div>
                )}
              </CheckboxGroup>
            </div>
          </div>
          <Button
            startDate={props.startDate}
            endDate={props.endDate}
            firebase={props.firebase}
            selectedSources={selectedSources}
            onButtonPress={onButtonPress}
          />
        </div>
      ) : (
        <Timeline articles={props.articles} />
      )}
    </div>
  );
}

export default connect(mapStateToProps)(NewsArchiver);
