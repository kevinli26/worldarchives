import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import moment from "moment";

function Timeline({ articles }) {
  return (
    <div
      style={{
        backgroundColor: "#457B9D",
        width: "100vw",
        height: "auto",
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
              iconStyle={{ background: "#1D3557", color: "#fff" }}
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
              <img
                style={{ float: "center" }}
                width="200px"
                height="200px"
                src={article.urlToImage}
              />
              <p>{article.content}</p>
            </VerticalTimelineElement>
          );
        })}
      </VerticalTimeline>
    </div>
  );
}

export default Timeline;
