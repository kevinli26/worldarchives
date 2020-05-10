import React, { useState, useEffect } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import SmoothCollapse from "react-smooth-collapse";

function Timeline({ articles }) {
  const [articleState, setArticleState] = useState({});
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    articles.map((article) => {
      var prev = articleState;
      if (!prev[article.title]) {
        prev[article.title] = false;
      }
      setArticleState(prev);
    });
  }, []);

  useEffect(() => {
    console.log(articleState);
  }, [articleState]);

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
                  color: "#E63946",
                }}
                className="vertical-timeline-element-title"
              >
                {article.title}
              </h3>
              <h4 className="vertical-timeline-element-subtitle">
                {article.author}
              </h4>
              <SmoothCollapse expanded={articleState[article.title]}>
                <img
                  style={{ float: "center", borderRadius: "10%" }}
                  width="180px"
                  height="180px"
                  src={article.urlToImage}
                />
                <p>{article.content}</p>
              </SmoothCollapse>
            </VerticalTimelineElement>
          );
        })}
      </VerticalTimeline>
    </div>
  );
}

export default Timeline;
