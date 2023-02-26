import React from "react";
import $ from "jquery";
import Logs from "../../components/log";
export default function Page({}) {
  return (
    <>
      <div>
        <div>
          <input name="Add domain" placeholder="google.com" />
          <button>Block</button>
          <button>Allow</button>
        </div>
        <div>
          <Logs />
        </div>
      </div>
    </>
  );
}
