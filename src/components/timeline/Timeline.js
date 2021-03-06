/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Timeline as AntTimeline,
  Card,
  Popconfirm,
  Select,
  Divider,
  Input,
  Empty,
  PageHeader,
} from "antd";
import axios from "axios";
import moment from "moment";
import {
  getTimeline,
  updateAppData,
  saveTimelinePost,
  setData,
} from "../../store/data/actions";
import { connect } from "react-redux";
import AddPost from "./AddPost";
import colors, { Icon, Tag } from "@codedrops/react-ui";
import "./Timeline.scss";
import _ from "lodash";
import randomColor from "randomcolor";

const { Option } = Select;

const Timeline = ({
  timeline,
  getTimeline,
  updateAppData,
  session,
  saveTimelinePost,
  setData,
}) => {
  const { data, groupId } = timeline;
  const [currentPost, setCurrentPost] = useState(null);
  const [visibility, setVisibility] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    getTimeline();
  }, [groupId]);

  const editPost = (id) => async () => {
    const [post] = data.filter((post) => post._id === id);
    setCurrentPost(post);
    setVisibility(true);
  };

  const deletePost = (id) => async () => {
    // setLoading(true);
    await axios.delete(`/timeline/${id}`);
    getTimeline();
    // setLoading(false);
  };

  const addItem = async () => {
    if (!name) return;

    updateAppData(
      { name, color: randomColor() },
      { action: "CREATE", key: "timeline" }
    );
    setName("");
  };

  const handleDataChange = (value, key) => {
    setData("timeline", { [key]: value });
  };

  const timelineGroups = _.get(session, "timeline", []);
  const timelineMap = _.keyBy(timelineGroups, "_id");

  // const getTimelineColor = (groupId) => {
  //   const color = _.get(timelineMap, [groupId, "color"], colors.strokeOne);
  //   return color;
  // };

  // console.log("timelineMap::-", timelineMap);

  return (
    <section id="timeline">
      <PageHeader
        className="page-header"
        ghost={false}
        onBack={null}
        title="Timeline"
        extra={[
          <Select
            key="group-list"
            className="mr"
            allowClear
            size="small"
            style={{ width: 140 }}
            placeholder="All groups"
            value={groupId}
            onChange={(value) => handleDataChange(value, "groupId")}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <Divider style={{ margin: "4px 0" }} />
                <div
                  style={{
                    display: "flex",
                    flexWrap: "nowrap",
                    padding: "0 8px",
                    alignItems: "center",
                  }}
                >
                  <Input
                    style={{ flex: "auto" }}
                    size="small"
                    value={name}
                    placeholder="New Group"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <a
                    style={{
                      flex: "none",
                      padding: "8px",
                      display: "block",
                      cursor: "pointer",
                    }}
                    onClick={addItem}
                  >
                    <Icon type="plus" size={12} />
                  </a>
                </div>
              </div>
            )}
          >
            {timelineGroups.map(({ name, _id }) => (
              <Option key={_id}>{name}</Option>
            ))}
          </Select>,
          <AddPost
            key="add-icon"
            post={currentPost}
            visibility={visibility}
            setVisibility={setVisibility}
            saveTimelinePost={saveTimelinePost}
            timelineGroups={timelineGroups}
            defaultTimeline={groupId}
          />,
        ]}
      />
      {data.length ? (
        <div className="timeline">
          <AntTimeline>
            {data.map((item) => {
              const { groupId } = item;

              const timelineTags = groupId.map((id) => (
                <Tag
                  key={id}
                  style={{
                    fontSize: "10px",
                    marginLeft: "0",
                    padding: "0 2px",
                  }}
                  color={_.get(timelineMap, [id, "color"], "steel")}
                >
                  {_.get(timelineMap, [id, "name"])}
                </Tag>
              ));
              return (
                <AntTimeline.Item color={colors.bar} key={item._id}>
                  <Card>
                    <span style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
                      {moment(item.date).format("DD,MMM")}:&nbsp;
                    </span>
                    {item.content}

                    <div>{timelineTags}</div>
                    <div className="actions">
                      <Icon
                        size={12}
                        key="edit-post"
                        type="edit"
                        onClick={editPost(item._id)}
                      />
                      <Popconfirm
                        placement="bottomRight"
                        title="Delete?"
                        onConfirm={deletePost(item._id)}
                      >
                        <Icon size={12} key="delete-post" type="delete" />
                      </Popconfirm>
                    </div>
                  </Card>
                </AntTimeline.Item>
              );
            })}
          </AntTimeline>
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
      {/* <Button onClick={() => setPage(page => page + 1)}>Load</Button> */}
    </section>
  );
};

const mapStateToProps = ({ data: { timeline }, app: { session } }) => ({
  timeline,
  session,
});

export default connect(mapStateToProps, {
  getTimeline,
  updateAppData,
  saveTimelinePost,
  setData,
})(Timeline);
