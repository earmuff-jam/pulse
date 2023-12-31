package handler

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/mohit2530/communityCare/db"
	"github.com/mohit2530/communityCare/model"
)

// GetEventHealthCheck ...
// swagger:route GET /api/v1/health
//
// # Health Check
//
// Health Check to test if the application api layer is operational or not. This api functionality
// does not attempt to connect with the backend service. It is designed to support heartbeat support system.
//
// Responses:
// 200: Message
// 400: Message
// 404: Message
// 500: Message
func GetEventHealthCheck(rw http.ResponseWriter, r *http.Request, user string) {
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode("Health check concluded. Status shows all services are operational.")
}

// GetAllEvents ...
// swagger:route GET /api/v1/events
//
// # Retrieves the list of events
//
// Retrieves the list of events that are happening currently in the application. Currently
// with the v1 there is no limit to the amount of events that can be applied therefore all
// events that are not deactivated are displayed.
//
// Responses:
// 200: []Event
// 400: Message
// 404: Message
// 500: Message
func GetAllEvents(rw http.ResponseWriter, r *http.Request, user string) {
	resp, err := db.RetrieveAllEvents(user)
	if err != nil {
		log.Printf("Unable to retrieve all existing events. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// GetAllItems ...
// swagger:route GET /api/v1/items{id}
//
// # Retrieves the list of events
//
// Responses:
// 200: []Item
// 400: Message
// 404: Message
// 500: Message
func GetAllItems(rw http.ResponseWriter, r *http.Request, user string) {
	vars := mux.Vars(r)
	eventID, ok := vars["id"]
	if !ok || len(eventID) <= 0 {
		log.Printf("Unable to retrieve items without event id. ")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	parsedUUID, err := uuid.Parse(eventID)
	if err != nil {
		log.Printf("Unable to retrieve events with provided id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}
	resp, err := db.RetrieveAllItems(user, parsedUUID)
	if err != nil {
		log.Printf("Unable to retrieve all existing events. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// CreateNewEvent ...
// swagger:route POST /api/v1/events
//
// # Create a new event
//
// Parameters:
//   - name: id
//     in: query
//     description: The id of the new event
//     type: string
//     required: false
//   - name: title
//     in: query
//     description: The title for the event
//     type: string
//     required: true
//   - name: description
//     in: query
//     description: The description for the event
//     type: string
//     required: true
//   - name: cause
//     in: query
//     description: The cause related to the event. Eg, Celebrations, Fundraising
//     type: string
//     required: true
//   - name: image_url
//     in: query
//     description: The image_url related to the event.
//     type: string
//     required: false
//   - name: street
//     in: query
//     description: The street address of the event.
//     type: string
//     required: true
//   - name: city
//     in: query
//     description: The city address of the event.
//     type: string
//     required: true
//   - name: state
//     in: query
//     description: The state of the event.
//     type: string
//     required: true
//   - name: zip
//     in: query
//     description: The zip code of the event.
//     type: string
//     required: true
//   - name: boundingbox
//     in: query
//     description: The boundingbox for the map of the event.
//     type: string
//     required: false
//   - name: class
//     in: query
//     description: The class for the map of the event.
//     type: string
//     required: false
//   - name: display_name
//     in: query
//     description: The display_name for the map of the event.
//     type: string
//     required: false
//   - name: importance
//     in: query
//     description: The importance for the map of the event.
//     type: string
//     required: false
//   - name: lat
//     in: query
//     description: The lattitude for the event.
//     type: string
//     required: false
//   - name: licence
//     in: query
//     description: The licence of the map for the event.
//     type: string
//     required: false
//   - name: lon
//     in: query
//     description: The longitude for the event.
//     type: string
//     required: false
//   - name: osm_id
//     in: query
//     description: The osm_id of the map type for the event.
//     type: string
//     required: false
//   - name: osm_type
//     in: query
//     description: The osm_type of the map type for the event.
//     type: string
//     required: false
//   - name: place_id
//     in: query
//     description: The place_id of the map type for the event.
//     type: string
//     required: false
//   - name: powered_by
//     in: query
//     description: The text of who supplies this information for the event.
//     type: string
//     required: false
//   - name: type
//     in: query
//     description: The type of the map specific for the event.
//     type: string
//     required: false
//   - name: project_type
//     in: query
//     description: The project_type for the event. Eg, Education, Social Services
//     type: string
//     required: true
//   - name: comments
//     in: query
//     description: The comments about the event left by the creator.
//     type: string
//     required: false
//   - name: registration_link
//     in: query
//     description: The registration link about the event left by the creator.
//     type: string
//     required: false
//   - name: max_attendees
//     in: query
//     description: The maximum number of attendees estimated by the creator.
//     type: string
//     required: true
//   - name: attendees
//     in: query
//     description: The list of attendees of the event
//     type: array
//     required: false
//   - name: required_total_man_hours
//     in: query
//     description: The total estimated man hours for the event
//     type: int
//     required: true
//   - name: deactivated
//     in: query
//     description: The state of the event - activated and deactivated events
//     type: boolean
//     required: false
//   - name: deactivated_reason
//     in: query
//     description: If deactivated, the reason on why the event is deactivated
//     type: string
//     required: false
//   - name: start_date
//     in: query
//     description: The start date of the event.
//     type: DateTime
//     required: true
//   - name: start_date
//     in: query
//     description: The start date of the event.
//     type: DateTime
//     required: true
//   - name: created_by
//     in: query
//     description: The created date of the event.
//     type: DateTime
//     required: true
//   - name: updated_by
//     in: query
//     description: The updated date of the event.
//     type: DateTime
//     required: true
//   - name: sharable_groups
//     in: query
//     description: The group of users who the event is shared with.
//     type: array
//     required: true
//
// Responses:
// 200: []Event
// 400: Message
// 404: Message
// 500: Message
func CreateNewEvent(rw http.ResponseWriter, r *http.Request, user string) {

	draftEvent := &model.Event{}
	err := json.NewDecoder(r.Body).Decode(draftEvent)
	r.Body.Close()
	if err != nil {
		log.Printf("Unable to decode request parameters. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	resp, err := db.SaveNewEvent(user, draftEvent)
	if err != nil {
		log.Printf("Unable to create new event. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// AddItemToEvent ...
// swagger:route POST /api/v1/item
//
// # Update an existing event
//
// Parameters:
//   - name: name
//     in: query
//     description: The name of the item to add to the event storage list
//     type: string
//     required: true
//   - name: eventID
//     in: query
//     description: The eventID of the project that the item belongs to
//     type: string
//     required: true
//   - name: description
//     in: query
//     description: The description of the item
//     type: string
//     required: true
//   - name: quantity
//     in: query
//     description: The quantity of the item to add into the storage container
//     type: int
//     required: true
//   - name: location
//     in: query
//     description: The location of the item to add into the storage container.
//     type: string
//     required: true
//
// Responses:
// 200: Event
// 400: Message
// 404: Message
// 500: Message
func AddItemToEvent(rw http.ResponseWriter, r *http.Request, user string) {

	draftItem := &model.Item{}
	err := json.NewDecoder(r.Body).Decode(draftItem)
	r.Body.Close()
	if err != nil {
		log.Printf("Unable to decode request parameters. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	resp, err := db.AddItem(user, draftItem)
	if err != nil {
		log.Printf("Unable to add item. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// UpdateExistingEvent ...
// swagger:route POST /api/v1/events
//
// # Update an existing event
//
// Parameters:
//   - name: id
//     in: query
//     description: The id of the event to be updated
//     type: string
//     required: true
//   - name: column_name
//     in: query
//     description: The column name to be updated
//     type: string
//     required: true
//   - name: column_value
//     in: query
//     description: The column value to be updated
//     type: string
//     required: true
//
// Responses:
// 200: Event
// 400: Message
// 404: Message
// 500: Message
func UpdateExistingEvent(rw http.ResponseWriter, r *http.Request, user string) {

	draftEvent := &model.Event{}
	err := json.NewDecoder(r.Body).Decode(draftEvent)
	r.Body.Close()
	if err != nil {
		log.Printf("Unable to decode request parameters. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	resp, err := db.UpdateEvent(user, draftEvent)
	if err != nil {
		log.Printf("Unable to update event. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// UpdateItemDetails ...
// swagger:route PUT /api/v1/items/{id}
//
// # Update an existing item details
//
// Parameters:
//   - name: id
//     in: query
//     description: The id of the item to be updated
//     type: string
//     required: true
//   - name: column
//     in: query
//     description: The column name to be updated
//     type: string
//     required: true
//   - name: value
//     in: query
//     description: The column value to be updated
//     type: string
//     required: true
//   - name: eventID
//     in: query
//     description: The event id for the item
//     type: string
//     required: true
//   - name: itemID
//     in: query
//     description: The item id that needs to be updated
//     type: string
//     required: true
//   - name: userID
//     in: query
//     description: The user id
//     type: string
//     required: true
//
// Responses:
// 200: ItemDetails
// 400: Message
// 404: Message
// 500: Message
func UpdateItemDetails(rw http.ResponseWriter, r *http.Request, user string) {

	draftItem := &model.ItemToUpdate{}
	err := json.NewDecoder(r.Body).Decode(draftItem)
	r.Body.Close()
	if err != nil {
		log.Printf("Unable to decode request parameters. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	resp, err := db.UpdateItem(user, draftItem)
	if err != nil {
		log.Printf("Unable to update item. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// UpdateEventAvatar ...
// swagger:route POST /api/v1/event/{id}/updateAvatar
//
// # Updates the current event image for the selected event. Does not meddle with anything else.
//
// Parameters:
//   - name: UpdateEventAvatar
//     in: query
//     description: The full file details of the avatar for the selected event.
//     type: string
//     required: true
//
// Responses:
// 200: UserDetails
// 400: Message
// 404: Message
// 500: Message
func UpdateEventAvatar(rw http.ResponseWriter, r *http.Request, user string) {
	vars := mux.Vars(r)
	userID := vars["id"]

	if len(userID) <= 0 {
		log.Printf("Unable to retrieve event with empty id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	err := r.ParseMultipartForm(10 << 20) // 10 MB max
	if err != nil {
		log.Printf("Unable to parse form file. error  %+v", err)
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("eventSrc")
	if err != nil {
		log.Printf("Unable to form file properly. error  %+v", err)
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Read file data into a buffer
	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		http.Error(rw, err.Error(), http.StatusInternalServerError)
		return
	}

	resp, err := db.UpdateEventAvatar(user, userID, header, fileBytes)
	if err != nil {
		log.Printf("Unable to update profile avatar. error: +%v", err)
		rw.WriteHeader(http.StatusInternalServerError)
		return
	}

	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// GetAllEventReports ...
// swagger:route GET /api/v1/report/{id}
//
// # Retrieves the list of reports made against any event
//
// Responses:
// 200: []Report
// 400: Message
// 404: Message
// 500: Message
func GetAllEventReports(rw http.ResponseWriter, r *http.Request, user string) {
	vars := mux.Vars(r)
	eventID := vars["id"]

	if len(eventID) <= 0 {
		log.Printf("Unable to retrieve reports with empty id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	resp, err := db.RetrieveAllReports(user, eventID)
	if err != nil {
		log.Printf("Unable to retrieve report details. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return

	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// CreateNewReport ...
// swagger:route POST /api/v1/report
//
// # Create a new report against an event
//
// Parameters:
//   - name: id
//     in: query
//     description: The id of the new report
//     type: string
//     required: false
//   - name: subject
//     in: query
//     description: The subject for the report
//     type: string
//     required: true
//   - name: description
//     in: query
//     description: The description for the report
//     type: string
//     required: true
//   - name: event_location
//     in: query
//     description: The event location of the event.
//     type: string
//     required: true
//   - name: organizer_name
//     in: query
//     description: The organizer name of the event.
//     type: string
//     required: true
//   - name: eventID
//     in: query
//     description: The eventID of the selected event.
//     type: string
//     required: true
//   - name: created_by
//     in: query
//     description: The created date of the event.
//     type: DateTime
//     required: true
//   - name: created_at
//     in: query
//     description: The creator ID of the user.
//     type: string
//     required: true
//   - name: updated_by
//     in: query
//     description: The updator ID of the user.
//     type: string
//     required: true
//   - name: updated_at
//     in: query
//     description: The updated date of the event.
//     type: DateTime
//     required: true
//   - name: sharable_groups
//     in: query
//     description: The group of users who the event is shared with.
//     type: array
//     required: true
//
// Responses:
// 200: []Event
// 400: Message
// 404: Message
// 500: Message
func CreateNewReport(rw http.ResponseWriter, r *http.Request, user string) {

	draftReport := &model.ReportEvent{}
	err := json.NewDecoder(r.Body).Decode(draftReport)
	r.Body.Close()
	if err != nil {
		log.Printf("Unable to decode request parameters. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	resp, err := db.SaveNewReport(user, draftReport)
	if err != nil {
		log.Printf("Unable to create new report. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// GetUserVolunteerDetails ...
// swagger:route GET /api/v1/volunteering/{userID}
//
// # Retrieves the list of volunteering activities select user has completed
//
// Responses:
// 200: []VolunteeringDetails
// 400: Message
// 404: Message
// 500: Message
func GetUserVolunteerDetails(rw http.ResponseWriter, r *http.Request, user string) {
	vars := mux.Vars(r)
	id, ok := vars["id"]
	if !ok || len(id) <= 0 {
		log.Printf("Unable to retrieve events without an id. ")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	parsedUUID, err := uuid.Parse(id)
	if err != nil {
		log.Printf("Unable to retrieve events with provided id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	resp, err := db.RetrieveVolunteerHours(user, parsedUUID, "userID")
	if err != nil {
		log.Printf("Unable to retrieve all volunteering hours. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// GetVolunteerHours ...
// swagger:route GET /api/v1/volunteering
//
// # Retrieves the list of volunteering activities selected event has recieved
//
// Responses:
// 200: []VolunteeringDetails
// 400: Message
// 404: Message
// 500: Message
func GetVolunteerHours(rw http.ResponseWriter, r *http.Request, user string) {
	vars := mux.Vars(r)
	id, ok := vars["id"]
	if !ok || len(id) <= 0 {
		log.Printf("Unable to retrieve events without event id. ")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	parsedUUID, err := uuid.Parse(id)
	if err != nil {
		log.Printf("Unable to retrieve events with provided id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	resp, err := db.RetrieveVolunteerHours(user, parsedUUID, "eventID")
	if err != nil {
		log.Printf("Unable to retrieve all volunteering hours. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// CreateVolunteerHours ...
// swagger:route POST /api/v1/volunteering
//
// # Adds hours and skill to a required volunteering item.
// Supports the ability to add volunteer hours
//
// Parameters:
//   - name: eventID
//     in: query
//     description: The eventID of the event the project is related to
//     type: string
//     required: true
//   - name: userID
//     in: query
//     description: The userID of author submitting request
//     type: string
//     required: true
//   - name: volunteeringActivity
//     in: query
//     description: The volunteeringActivity name
//     type: string
//     required: true
//   - name: volunteeringHours
//     in: query
//     description: The volunteeringHours in hours
//     type: string
//     required: true
//   - name: created_by
//     in: query
//     description: The creator of the volunteering skill. Defaults to userID
//     type: string
//     required: false
//   - name: created_at
//     in: query
//     description: The created date of the volunteering skill. Defaults to current time.
//     type: string
//     required: false
//   - name: updated_by
//     in: query
//     description: The updator of the volunteering skill. Defaults to userID
//     type: string
//     required: false
//   - name: updated_at
//     in: query
//     description: The updated date of the volunteering skill. Defaults to userID
//     type: string
//     required: false
//
// Responses:
// 200: VolunteeringDetails
// 400: Message
// 404: Message
// 500: Message
func CreateVolunteerHours(rw http.ResponseWriter, r *http.Request, user string) {

	draftEvent := &model.VolunteeringDetails{}
	err := json.NewDecoder(r.Body).Decode(draftEvent)
	r.Body.Close()
	if err != nil {
		log.Printf("Unable to decode request parameters. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	resp, err := db.SaveVolunteeringEvent(user, draftEvent)
	if err != nil {
		log.Printf("Unable to save volunteering activities. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return
	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// GetEvent ...
// swagger:route GET /api/v1/event/{id}
//
// # Retrieves the selected event with the specific id
//
// Parameters:
//   - name: eventID
//     in: query
//     description: The eventID for any event
//     type: string
//     required: true
//
// Responses:
// 200: []Event
// 400: Message
// 404: Message
// 500: Message
func GetEvent(rw http.ResponseWriter, r *http.Request, user string) {

	vars := mux.Vars(r)
	eventID, ok := vars["id"]
	if !ok || len(eventID) <= 0 {
		log.Printf("Unable to retrieve events without event id. ")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	parsedUUID, err := uuid.Parse(eventID)
	if err != nil {
		log.Printf("Unable to retrieve events with provided id")
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	// fetch db
	resp, err := db.RetrieveEvent(user, parsedUUID)
	if err != nil {
		log.Printf("Unable to retrieve events. err: %+v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(nil)
		return
	}

	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// GetAllStates ...
// swagger:route GET /api/v1/states
//
// # Retrieves the list of states of the USA
//
// Responses:
// 200: []State
// 400: Message
// 404: Message
// 500: Message
func GetAllStates(rw http.ResponseWriter, r *http.Request, user string) {

	resp, err := db.RetrieveAllState(user)
	if err != nil {
		log.Printf("Unable to retrieve all existing states. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return

	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// GetAllEventCauses ...
// swagger:route GET /api/v1/causes
//
// # Retrieves the list of states of the USA
//
// Responses:
// 200: []State
// 400: Message
// 404: Message
// 500: Message
func GetAllEventCauses(rw http.ResponseWriter, r *http.Request, user string) {

	resp, err := db.RetrieveAllEventCause(user)
	if err != nil {
		log.Printf("Unable to retrieve all event causes. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return

	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// GetAllProjectTypes ...
// swagger:route GET /api/v1/types
//
// # Retrieves the list of types of project
//
// Responses:
// 200: []State
// 400: Message
// 404: Message
// 500: Message
func GetAllProjectTypes(rw http.ResponseWriter, r *http.Request, user string) {

	resp, err := db.RetrieveAllProjectType(user)
	if err != nil {
		log.Printf("Unable to retrieve all project types. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return

	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}

// GetAllStorageLocations ...
// swagger:route GET /api/v1/locations
//
// # Retrieves the list of locations that can be used to store items associated to a event
//
// Responses:
// 200: []StorageLocation
// 400: Message
// 404: Message
// 500: Message
func GetAllStorageLocations(rw http.ResponseWriter, r *http.Request, user string) {

	resp, err := db.RetrieveAllStorageLocation(user)
	if err != nil {
		log.Printf("Unable to retrieve storage locations. error: +%v", err)
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(err)
		return

	}
	rw.Header().Add("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	json.NewEncoder(rw).Encode(resp)
}
