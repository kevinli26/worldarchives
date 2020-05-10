import React, { useState, useEffect } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faBackward } from "@fortawesome/free-solid-svg-icons";
import SmoothCollapse from "react-smooth-collapse";

function Timeline({ articles, setSelecting }) {
  const [articleState, setArticleState] = useState({});
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    articles.map((article) => {
      console.log(article);
      var prev = articleState;
      if (!prev[article.title]) {
        prev[article.title] = false;
      }
      setArticleState(prev);
    });
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#457B9D",
        width: "auto",
        height: "auto",
        minHeight: "100vh",
      }}
    >
      <VerticalTimeline>
        {articles.map((article) => {
          return (
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              contentStyle={{ background: "#1D3557", color: "#fff" }}
              contentArrowStyle={{
                borderRight: "7px solid  #1D3557",
              }}
              date={moment(article.publishedAt).format(
                "dddd, MMMM Do YYYY, h:mm:ss a"
              )}
              icon={<FontAwesomeIcon icon={faEllipsisH} size="lg" />}
              iconStyle={{ background: "#1D3557", color: "#fff" }}
              iconOnClick={() => {
                // document.getElementById(`${article.title}`).style.display =
                //   document.getElementById(`${article.title}`).style.display ===
                //   "none"
                //     ? "block"
                //     : "none";
                var x = articleState;
                x[article.title] = !articleState[article.title];
                setArticleState(x);
                forceUpdate();
              }}
            >
              <h3
                style={{
                  // color: "#E63946",
                  color:
                    article.sentiment.score < 0
                      ? `rgb(${Math.abs(article.sentiment.score) * 255},0,0)`
                      : `rgb(0,${Math.abs(article.sentiment.score) * 255},0)`,
                  // article.sentiment.score < 0
                  //   ? `rgb(
                  //       ${Math.min(
                  //         255,
                  //         100000 *
                  //           Math.abs(
                  //             (article.sentiment.magnitude /
                  //               article.content.length) *
                  //               article.sentiment.score
                  //           )
                  //       )},
                  //       0,
                  //       0
                  //     )`
                  //   : `rgb(
                  //       0,
                  //       ${Math.min(
                  //         255,
                  //         100000 *
                  //           Math.abs(
                  //             (article.sentiment.magnitude /
                  //               article.content.length) *
                  //               article.sentiment.score
                  //           )
                  //       )},
                  //       0
                  //     )`,
                }}
                className="vertical-timeline-element-title"
              >
                {article.title}
              </h3>
              <h4
                className="vertical-timeline-element-subtitle"
                style={{ marginTop: "5px" }}
              >
                {article.author}
              </h4>
              <h5>
                Category:
                {article.classifications.length > 0 ? (
                  <span>
                    {article.classifications[0].name.replace("/", " ")}
                  </span>
                ) : (
                  " ???"
                )}
              </h5>
              <SmoothCollapse expanded={articleState[article.title]}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <img
                    style={{ borderRadius: "10%" }}
                    width="180px"
                    height="180px"
                    src={article.urlToImage}
                  />
                </div>
                <p>{article.content}</p>
              </SmoothCollapse>
            </VerticalTimelineElement>
          );
        })}
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          icon={<FontAwesomeIcon icon={faBackward} size="lg" />}
          iconStyle={{ background: "#1D3557", color: "#fff" }}
          iconOnClick={() => {
            setSelecting(true);
          }}
        ></VerticalTimelineElement>
      </VerticalTimeline>
    </div>
  );
}

export default Timeline;
