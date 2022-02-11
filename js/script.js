const elementTypes = {
  CONTAINER: "container",
  IMAGE: "image",
  TEXT: "text",
  BUTTON: "button",
  INPUT: "input",
  SECTION: "section",
  DROPDOWN: "dropdown",
  LINK: "link",
};

const elementBehaviors = {
  DROPDOWN: "dropdown",
};

function getCalendarEvents() {
  const CALENDAR_ID = "contact%40eauw.org";
  const API_KEY = "AIzaSyDZaZSBkC1GCorg-PhrzswIaCQ4aOmOr24"; // read-only, restricted to https://eauw.org

  fetch(
    "https://www.googleapis.com/calendar/v3/calendars/" +
      CALENDAR_ID +
      "/events?key=" +
      API_KEY
  )
    .then(function (res) {
      if (res.ok) {
        return res.json();
      } else {
        somethingWentWrong("response invalid.");
      }
    })
    .then(function (data) {
      if (data.items.length === 0) {
        const textDiv = document.getElementById("text-id-27-");
        textDiv.innerHTML = "No events for now. Check back later!";
        textDiv.setAttribute("style", "display: block;");
        return;
      }

      const finalData = data.items.filter((item) => item.start);

      finalData
        .sort(function (a, b) {
          return new Date(b.start.dateTime) - new Date(a.start.dateTime);
        })
        .reverse();

      const eventsParent = document.getElementsByClassName("events")[0];
      const eventsList = document.createElement("li");
      eventsParent.appendChild(eventsList);

      const today = new Date();
      var currentDay = new Date(data.items[0].start.dateTime).toLocaleString(
        "default",
        { day: "numeric" }
      );
      var currentMonth = new Date(data.items[0].start.dateTime).toLocaleString(
        "default",
        { month: "long" }
      );

      var printedEventsCount = 0;
      for (var i = 0; i < finalData.length; i++) {
        if (printedEventsCount > 4) break;

        const eventDate = new Date(finalData[i].start.dateTime);

        // if earlier than today, skip
        if (today > eventDate) continue;

        // if private event, skip
        if (finalData[i].visibility === "private") continue;

        if (!eventsList.hasChildNodes()) {
          const firstEventMonth = document.createElement("div");
          firstEventMonth.className = "event-month";
          currentMonth = eventDate.toLocaleString("default", {
            month: "long",
          });
          firstEventMonth.innerHTML = currentMonth;
          eventsList.appendChild(firstEventMonth);

          const eventDay = document.createElement("div");
          eventDay.className = "event-day";
          currentDay = eventDate.toLocaleString("default", { day: "numeric" });
          eventDay.innerHTML = currentDay;

          const eventInfo = document.createElement("div");
          eventInfo.className = "event-info";

          const eventTitle = document.createElement("span");
          eventTitle.className = "event-title";
          eventTitle.innerHTML =
            '<a href="' +
            finalData[i].htmlLink +
            '" target="_blank">' +
            finalData[i].summary +
            "</a>";

          eventInfo.append(eventTitle);

          tippy(eventTitle.firstChild, {
            content: "View in Google Calendar",
            placement: "right",
            theme: "my",
          });

          if ("location" in finalData[i]) {
            const eventLocation = document.createElement("span");
            eventLocation.className = "event-location";
            eventLocation.innerHTML = makeLocation(finalData[i].location);
            eventInfo.append(eventLocation);
          }

          const eventDescription = document.createElement("span");
          eventDescription.className = "event-description";
          if ("description" in finalData[i]) {
            eventDescription.innerHTML = finalData[i].description;
            eventInfo.append(eventDescription);
          }

          const eventTime = document.createElement("span");
          eventTime.className = "event-time";
          eventTime.innerHTML =
            '<i class="fas fa-clock fa-fw"></i>' +
            eventDate.toLocaleTimeString("en-US", {
              timeZone: "America/Chicago",
              timeStyle: "short",
            }) +
            " &ndash; " +
            new Date(finalData[i].end.dateTime).toLocaleTimeString("en-US", {
              timeZone: "America/Chicago",
              timeStyle: "short",
            });
          eventInfo.append(eventTime);

          const event = document.createElement("li");
          event.className = "event";
          event.append(eventDay, eventInfo);

          const innerMonthList = document.createElement("ul");
          innerMonthList.className = "month-events";
          innerMonthList.appendChild(event);
          printedEventsCount++;

          eventsList.appendChild(innerMonthList);

          continue;
        }

        // if month is same as current month, don't add a new month
        if (
          currentMonth ===
          eventDate.toLocaleString("default", { month: "long" })
        ) {
          const innerMonthList = document.querySelectorAll(
            ".month-events:last-child"
          );

          const eventDay = document.createElement("div");
          eventDay.className = "event-day";

          if (
            currentDay !==
            eventDate.toLocaleString("default", { day: "numeric" })
          ) {
            currentDay = eventDate.toLocaleString("default", {
              day: "numeric",
            });
            eventDay.innerHTML = currentDay;
          }

          const eventInfo = document.createElement("div");
          eventInfo.className = "event-info";

          const eventTitle = document.createElement("span");
          eventTitle.className = "event-title";
          eventTitle.innerHTML =
            '<a href="' +
            finalData[i].htmlLink +
            '" target="_blank">' +
            finalData[i].summary +
            "</a>";

          tippy(eventTitle.firstChild, {
            content: "View in Google Calendar",
            placement: "right",
            theme: "my",
          });
          eventInfo.append(eventTitle);

          if ("location" in finalData[i]) {
            const eventLocation = document.createElement("span");
            eventLocation.className = "event-location";
            eventLocation.innerHTML = makeLocation(finalData[i].location);
            eventInfo.append(eventLocation);
          }

          const eventDescription = document.createElement("span");
          eventDescription.className = "event-description";
          if ("description" in finalData[i]) {
            eventDescription.innerHTML = finalData[i].description;
            eventInfo.append(eventDescription);
          }

          const eventTime = document.createElement("span");
          eventTime.className = "event-time";
          eventTime.innerHTML =
            '<i class="fas fa-clock fa-fw"></i>' +
            eventDate.toLocaleTimeString("en-US", {
              timeZone: "America/Chicago",
              timeStyle: "short",
            }) +
            " &ndash; " +
            new Date(finalData[i].end.dateTime).toLocaleTimeString("en-US", {
              timeZone: "America/Chicago",
              timeStyle: "short",
            });
          eventInfo.append(eventTime);

          const event = document.createElement("li");
          event.className = "event";
          event.append(eventDay, eventInfo);
          innerMonthList[0].appendChild(event);
          printedEventsCount++;
        } else {
          const eventMonth = document.createElement("div");
          eventMonth.className = "event-month";
          currentMonth = eventDate.toLocaleString("default", {
            month: "long",
          });
          eventMonth.innerHTML = currentMonth;
          eventsList.appendChild(eventMonth);

          const eventDay = document.createElement("div");
          eventDay.className = "event-day";
          currentDay = eventDate.toLocaleString("default", { day: "numeric" });
          eventDay.innerHTML = currentDay;

          const eventInfo = document.createElement("div");
          eventInfo.className = "event-info";

          const eventTitle = document.createElement("span");
          eventTitle.className = "event-title";
          eventTitle.innerHTML =
            '<a href="' +
            finalData[i].htmlLink +
            '" target="_blank">' +
            finalData[i].summary +
            "</a>";
          eventInfo.append(eventTitle);

          tippy(eventTitle.firstChild, {
            content: "View in Google Calendar",
            placement: "right",
            theme: "my",
          });

          if ("location" in finalData[i]) {
            const eventLocation = document.createElement("span");
            eventLocation.className = "event-location";
            eventLocation.innerHTML = makeLocation(finalData[i].location);
            eventInfo.append(eventLocation);
          }

          if ("description" in finalData[i]) {
            const eventDescription = document.createElement("span");
            eventDescription.className = "event-description";
            eventDescription.innerHTML = finalData[i].description;
            eventInfo.append(eventDescription);
          }

          const eventTime = document.createElement("span");
          eventTime.className = "event-time";
          eventTime.innerHTML =
            '<i class="fas fa-clock fa-fw"></i>' +
            eventDate.toLocaleTimeString("en-US", {
              timeZone: "America/Chicago",
              timeStyle: "short",
            }) +
            " &ndash; " +
            new Date(finalData[i].end.dateTime).toLocaleTimeString("en-US", {
              timeZone: "America/Chicago",
              timeStyle: "short",
            });
          eventInfo.append(eventTime);

          const event = document.createElement("li");
          event.className = "event";
          event.append(eventDay, eventInfo);

          const innerMonthList = document.createElement("ul");
          innerMonthList.className = "month-events";
          innerMonthList.appendChild(event);
          printedEventsCount++;

          eventsList.appendChild(innerMonthList);

          continue;
        }
      }

      if (!eventsList.hasChildNodes()) {
        eventsParent.remove();
        const textDiv = document.getElementById("text-id-27-");
        textDiv.innerHTML = "No events for now. Check back later!";
        textDiv.setAttribute("style", "display: block;");
        return;
      }

      const lastUpdated = document.createElement("div");
      lastUpdated.className = "last-updated";
      lastUpdated.innerHTML =
        "Last updated " +
        moment(today).fromNow() +
        ' via <a href="https://calendar.google.com/calendar/u/0?cid=Y29udGFjdEBlYXV3Lm9yZw" target="_blank">Google Calendar</a>.';

      setInterval(function () {
        lastUpdated.innerHTML =
          "Last updated " +
          moment(today).fromNow() +
          ' via <a href="https://calendar.google.com/calendar/u/0?cid=Y29udGFjdEBlYXV3Lm9yZw" target="_blank">Google Calendar</a>.';
      }, 30000);

      document.getElementById("container-id-28-").appendChild(lastUpdated);
    })
    .catch(function (err) {
      somethingWentWrong(err);
    });
}

getCalendarEvents();

function somethingWentWrong(err) {
  const textDiv = document.getElementById("text-id-27-");
  textDiv.innerHTML =
    "Something went wrong when connecting to Google Calendar... " + err;
  textDiv.setAttribute("style", "display: block; font-style: italic;");
}

function makeLocation(location) {
  if (isValidUrl(location)) {
    return (
      '<i class="fas fa-desktop fa-fw"></i>' +
      '<a href="' +
      location +
      '" target="_blank">' +
      location +
      "</a>"
    );
  }
  return (
    '<i class="fas fa-map-marker-alt fa-fw"></i>' +
    '<a href="https://maps.google.com/?q=' +
    location +
    '" target="_blank" style="text-decoration:none;">' +
    location.split(",")[0] +
    "</a>"
  );
}

function isValidUrl(url) {
  try {
    new URL(url);
  } catch (e) {
    return false;
  }
  return true;
}

function initAspectJS() {
  getNestedElements(document.body).forEach((x) => {
    if (getElementBehavior(x) === elementBehaviors.DROPDOWN) {
      setBehaviorForElement(x, elementBehaviors.DROPDOWN);
    }
  });

  window.onresize = () => {
    getNestedElements(document.body).forEach((x) => {
      if (getElementType(x) === elementTypes.DROPDOWN) {
        x.style.position = bestCSSPositionForPopover(getElementForPopover(x));
      }
    });
  };
}

function setBehaviorForElement(element, behavior) {
  switch (behavior) {
    case elementBehaviors.DROPDOWN:
      setDropdownBehavior();
      break;
    default:
      break;
  }

  function setDropdownBehavior() {
    let shouldShowPopover = false;
    let didSetMouseEvents = false;
    element.onmouseenter = () => {
      shouldShowPopover = true;
      showDropdownForElement(element);

      if (!didSetMouseEvents) {
        const popover = getElementPopover(element);
        popover.onmouseenter = (e) => {
          shouldShowPopover = true;
          const popover = e.target;
          if (popover.parentElement == document.body) return;
          popover.style.display = "block";
        };
        popover.onmouseleave = (e) => {
          shouldShowPopover = false;
          const popover = e.target;
          setTimeout(() => {
            if (shouldShowPopover) return;
            popover.style.display = "none";
          });
        };
        const touchEvent = "ontouchstart" in window ? "touchstart" : "click";
        element.addEventListener(touchEvent, () => {
          if (isElementDropdownVisible(element)) {
            hideDropdownForElement(element);
          } else {
            showDropdownForElement(element);
          }
        });
      }
      didSetMouseEvents = true;
    };
    element.onmouseleave = () => {
      shouldShowPopover = false;
      setTimeout(() => {
        if (shouldShowPopover) return;
        const popover = getElementPopover(element);
        popover.style.display = "none";
      }, 100);
    };
  }
}

function removeBehaviorForElement(element) {
  element.onmouseover = null;
  element.onmouseleave = null;
}

function isElementDropdownVisible(element) {
  const popover = getElementPopover(element);
  return popover && popover.style.display !== "none";
}

function getElementPopover(element) {
  if (!element) return;
  const popoverID = popoverIDForElement(element);
  return document.getElementById(popoverID);
}

function getElementForPopover(popover) {
  return document.getElementById(popover.getAttribute("data-popover-for"));
}

function popoverIDForElement(element) {
  if (!element) return;
  return element.id + "popover";
}

function updateDropdownForElement(element) {
  const elementIsVisible = element.style.display === "block";
  if (isElementDropdownVisible(element) && elementIsVisible) {
    showDropdownForElement(element);
  } else if (!elementIsVisible) {
    hideDropdownForElement(element);
  }
}

function showDropdownForElement(element) {
  if (getElementBehavior(element) !== elementBehaviors.DROPDOWN) return;
  const popover = getElementPopover(element);
  moveElementToTopOfHierarchy(popover);
  popover.style.display = "block";
  const rectString = rectForPopover(element, popover);
  popover.style.left = rectString.x;
  popover.style.top = rectString.y;

  function moveElementToTopOfHierarchy(element) {
    if (!element || !element.parentNode) return;
    const firstChildOfParent =
      element.parentNode.children[element.parentNode.children.length - 1];
    element.parentNode.insertBefore(firstChildOfParent, element);
  }
}

function hideDropdownForElement(element) {
  const popover = getElementPopover(element);
  if (!popover) return;
  popover.style.display = "none";
}

function rectForPopover(element, popover) {
  const popoverWidth = popover.getBoundingClientRect().width;
  const canvasRect = document.body.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const rect = {
    x: 0,
    y: elementRect.y + elementRect.height,
  };

  let position = "none";
  if (popoverWidth >= canvasRect.width) {
    // width too large
    rect.x = canvasRect.x;
    position;
  } else if (
    elementRect.x + elementRect.width / 2 - popoverWidth / 2 > canvasRect.x &&
    elementRect.x + elementRect.width / 2 + popoverWidth / 2 <
      canvasRect.width + canvasRect.x
  ) {
    // center align is valid
    rect.x = elementRect.x + elementRect.width / 2 - popoverWidth / 2;
    position = "center";
  } else if (elementRect.x + popoverWidth < canvasRect.width + canvasRect.x) {
    // right align valid
    rect.x = elementRect.x;
    position = "right";
  } else if (elementRect.x + elementRect.width - popoverWidth > canvasRect.x) {
    // left align valid
    rect.x = elementRect.x + elementRect.width - popoverWidth;
    position = "left";
  }

  return {
    x: numToPixel(rect.x - canvasRect.x),
    y: numToPixel(rect.y - canvasRect.y),
    width: rect.width ? numToPixel(rect.width) : numToPixel(popoverWidth),
    position,
  };
}

function numToPixel(number) {
  return number + "px";
}

function getElementType(element) {
  return element.getAttribute("data-element-type");
}

function getNestedElements(element) {
  const children = [];
  Array.from(element.children).forEach((child) => {
    children.push(child);
    getNestedElements(child).forEach((nestedChild) => {
      children.push(nestedChild);
    });
  });
  return children;
}

function getElementBehavior(element) {
  return element.getAttribute("data-element-behavior");
}

function bestCSSPositionForPopover(element) {
  let currentElement = element.parentElement;
  let val;
  while (currentElement && !val) {
    const position = window.getComputedStyle(currentElement).position;
    switch (position) {
      case "fixed":
      case "absolute":
        val = position;
        break;
      default:
        break;
    }
    currentElement = currentElement.parentElement;
  }
  if (!val) {
    val = "absolute";
  }
  return val;
}

// forms

$("#email-form").submit(function (e) {
  e.preventDefault();
  $.ajax({
    url: "https://api.eauw.org/email",
    type: "POST",
    data: $("#email-form").serialize(),
    success: function () {
      window.location = "/success/index.html";
    },
  });
});
