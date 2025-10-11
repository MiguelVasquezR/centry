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
  }),
});

export const { useCreateUserMutation } = usersApi;
