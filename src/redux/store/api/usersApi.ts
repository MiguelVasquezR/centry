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
    updateUser: build.mutation({
      query: (user) => ({
        url: `/user/update/${user.id}`,
        method: "PUT",
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
      providesTags: ["users"],
    }),
    getUserById: build.query({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      transformResponse: (data: User) => {
        return {
          user: data,
        };
      },
    }),
    removeUser: build.mutation({
      query: (id) => ({
        url: `/user/remove?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),
    getUserByEmail: build.query({
      query: (email) => ({
        url: `/user/email/${email}`,
      }),
    }),
    getCurrentUser: build.query({
      query: () => {
        const userId = localStorage.getItem("userId") || "";
        return {
          url: `/user/${userId}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetUserFilerQuery,
  useLazyGetUserByIdQuery,
  useUpdateUserMutation,
  useRemoveUserMutation,
  useGetUserByEmailQuery,
  useGetCurrentUserQuery,
} = usersApi;
