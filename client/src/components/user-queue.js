import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import React from "react";

import {
  play,
  playFromQueue,
  playFromUserQueue
} from "../redux/actions/playerActions";
import { toggleUserQueue } from "../redux/actions/userActions";
import TrackItem from "./track-item";
import TrackList from "./track-list";
import modalStyles from "../styles/modal.module.css";
import slideTransition from "../styles/slideModal.module.css";
import styles from "../styles/library.module.css";

const UserQueue = () => {
  const dispatch = useDispatch();

  const isPlaying = useSelector(state => state.player.isPlaying);
  const isUserQueueOpen = useSelector(
    state => state.user.settings.isUserQueueOpen
  );
  const {
    currentTrack,
    index,
    queue,
    userQueueIndex,
    userQueue,
    context
  } = useSelector(state => state.player);
  const nextInUserQueue = userQueue
    ? userQueue.slice(userQueueIndex, userQueue.length)
    : [];
  const nextInPlayerQueue = queue.slice(index + 1);

  function handleToggleShowQueue() {
    dispatch(toggleUserQueue());
  }

  function handlePlayCurrent() {
    dispatch(play());
  }

  function handlePlayFromUserAddedQueue(index) {
    dispatch(playFromUserQueue(index));
  }

  function handlePlayFromQueue(index) {
    dispatch(playFromQueue(index));
  }

  const queueList = [
    {
      list: nextInUserQueue,
      id: "user-queue",
      title: "Next in your Queue",
      handlePlay: handlePlayFromUserAddedQueue
    },
    {
      list: nextInPlayerQueue,
      id: "queue",
      title: `Next from ${context.title}`,
      handlePlay: handlePlayFromQueue
    }
  ];

  const queueComponents = queueList
    .filter(queue => queue.list && queue.list.length)
    .map(queue => (
      <React.Fragment key={queue.id}>
        <span className={`${modalStyles.formTitle} ${styles.queueTitle}`}>
          {queue.title}
        </span>
        <TrackList
          tracks={queue.list}
          isPlaying={isPlaying}
          currentTrackID={currentTrack.id}
          handlePlay={
            queue.id === "user-queue"
              ? handlePlayFromUserAddedQueue
              : handlePlayFromQueue
          }
          isFromQueue
        />
      </React.Fragment>
    ));

  return (
    <CSSTransition
      in={isUserQueueOpen}
      timeout={350}
      classNames={slideTransition}
      unmountOnExit
    >
      <div className={styles.queueWrapper}>
        <div className={modalStyles.modalHeader}>
          <span className={modalStyles.modalTitle} style={{ color: "#ccc" }}>
            Your Queue
          </span>
          <button
            className={modalStyles.closeButton}
            onClick={handleToggleShowQueue}
            type="button"
          >
            <FontAwesomeIcon icon={faTimes} size="2x" />
          </button>
        </div>
        <div
          className={modalStyles.formInnerWrapper}
          style={{ maxHeight: "515px" }}
        >
          <span className={`${modalStyles.formTitle} ${styles.queueTitle}`}>
            Currently Playing
          </span>
          <TrackItem
            track={currentTrack}
            isActive={true}
            isPlaying={isPlaying}
            handlePlay={handlePlayCurrent}
            isFromQueue
          />
          {queueComponents}
        </div>
      </div>
    </CSSTransition>
  );
};

export default UserQueue;