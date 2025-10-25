import React from "react";

const CardPostSkeleton = () => {
  return (
    <article className="card p-5 mb-4">
      <div className="is-flex is-justify-content-space-between is-align-items-start is-flex-wrap-wrap">
        <div className="is-flex is-align-items-center is-gap-3">
          <div
            className="has-background-grey-lighter is-animate-pulse"
            style={{
              width: 48,
              height: 48,
              borderRadius: "16px",
            }}
          />
          <div>
            <div
              className="has-background-grey-lighter is-animate-pulse"
              style={{ width: 160, height: 16, borderRadius: 6 }}
            />
            <div
              className="has-background-grey-lighter is-animate-pulse mt-2"
              style={{ width: 120, height: 12, borderRadius: 6 }}
            />
          </div>
        </div>
        <div
          className="has-background-grey-lighter is-animate-pulse"
          style={{ width: 110, height: 34, borderRadius: 8 }}
        />
      </div>

      <div className="columns is-variable is-5 mt-3">
        <div className="column is-two-thirds">
          <div
            className="has-background-grey-lighter is-animate-pulse mb-3"
            style={{ width: 200, height: 20, borderRadius: 8 }}
          />
          <div
            className="has-background-grey-lighter is-animate-pulse mb-2"
            style={{ width: "100%", height: 18, borderRadius: 8 }}
          />
          <div
            className="has-background-grey-lighter is-animate-pulse mb-2"
            style={{ width: "90%", height: 18, borderRadius: 8 }}
          />
          <div
            className="has-background-grey-lighter is-animate-pulse"
            style={{ width: "80%", height: 18, borderRadius: 8 }}
          />
        </div>
        <div className="column is-one-third">
          <div
            className="has-background-grey-lighter is-animate-pulse"
            style={{ width: "100%", height: 140, borderRadius: 18 }}
          />
        </div>
      </div>

      <div className="is-flex is-align-items-center is-justify-content-space-between mt-4">
        <div className="is-flex is-align-items-center is-gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="has-background-grey-lighter is-animate-pulse"
              style={{ width: 110, height: 16, borderRadius: 6 }}
            />
          ))}
        </div>
        <div
          className="has-background-grey-lighter is-animate-pulse"
          style={{ width: 90, height: 16, borderRadius: 6 }}
        />
      </div>
    </article>
  );
};

export default CardPostSkeleton;
