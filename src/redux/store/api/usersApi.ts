import { apiSlice } from "./index";
import { User } from "@/src/types/user";

interface CreateUserResponse {
  message: string;
  status: number;
}

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    createUser: build.mutation<CreateUserResponse, Omit<User, "id">>({
      query: (user) => ({
        url: "/user/create",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),
    getUserFiler: build.query({
      query: () => ({
        url: "/user/get",
        method: "GET",
      }),
      transformResponse: (response) => {
        const grouped: Record<string, User[]> = {};
        response.data.forEach((u: User) => {
          const gen = u.tuition.slice(0, 3);
          if (!grouped[gen]) grouped[gen] = [];
          grouped[gen].push(u);
        });
        return grouped;
      },
    }),
  }),
});

export const { useCreateUserMutation, useGetUserFilerQuery } = usersApi;
