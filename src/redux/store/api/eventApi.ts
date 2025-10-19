import { apiSlice } from "./index";

import { EventFormValues, EventType } from "@/src/types/event";

export const eventApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getEventById: build.query<EventFormValues, string>({
      query: (id) => `/event/${id}`,
      providesTags: (result, error, id) => [{ type: "event", id }],
    }),
    createEvent: build.mutation<EventFormValues, Omit<EventFormValues, "id">>({
      query: (event) => ({
        url: "/event/create",
        method: "POST",
        body: event,
      }),
      invalidatesTags: ["event"],
    }),
    updateEvent: build.mutation<EventFormValues, EventFormValues>({
      query: (event) => ({
        url: "/event/update",
        method: "PUT",
        body: {
          id: event.id,
          data: event,
        },
      }),
      invalidatesTags: (result, error, movie) => [
        { type: "event", id: movie.id },
        "event",
      ],
    }),
    deleteEvent: build.mutation<void, string>({
      query: (id) => ({
        url: "/event/delete",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, id) => [{ type: "event", id }, "event"],
    }),
    getEvents: build.query<EventType[], void>({
      query: () => ({
        url: "/event/get",
        method: "GET",
      }),
      transformResponse: (response: { data: EventType[] }) => {
        return response.data;
      },
    }),
  }),
});

export const { useCreateEventMutation, useGetEventsQuery } = eventApi;
