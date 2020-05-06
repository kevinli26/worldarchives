import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

function Timeline({ articles }) {
  return (
    <div
      style={{
        backgroundColor: "grey",
        width: "100vw",
        height: "auto",
      }}
    >
      <VerticalTimeline>
        {articles.map((article) => {
          return (
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              contentStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
              contentArrowStyle={{
                borderRight: "7px solid  rgb(33, 150, 243)",
              }}
              date={article.publishedAt}
              iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            >
              <h3 className="vertical-timeline-element-title">
                {article.title}
              </h3>
              <h4 className="vertical-timeline-element-subtitle">
                {article.author}
              </h4>
              <img width="200px" height="200px" src={article.urlToImage} />
              <p>{article.content}</p>
            </VerticalTimelineElement>
          );
        })}
      </VerticalTimeline>
    </div>
  );
}

export default Timeline;
