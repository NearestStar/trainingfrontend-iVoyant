
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Employee, EmployeeInput } from "../types/employee";

export const employeeApi = createApi({
  reducerPath: "employeeApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/",
  }),

  tagTypes: ["Employee"],

  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], void>({
      query: () => "employees",

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Employee" as const,
                id,
              })),
              { type: "Employee" as const, id: "LIST" },
            ]
          : [{ type: "Employee" as const, id: "LIST" }],
    }),

    getEmployeeById: builder.query<Employee, number>({
      query: (id) => `employees/${id}`,
      providesTags: (_result, _error, id) => [
        { type: "Employee", id },
      ],
    }),

    addEmployee: builder.mutation<Employee, EmployeeInput>({
      query: (employee) => ({
        url: "employees",
        method: "POST",
        body: employee,
      }),

      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),

    updateEmployee: builder.mutation<
      Employee,
      { id: number; data: EmployeeInput }
    >({
      query: ({ id, data }) => ({
        url: `employees/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
      ],
    }),

    deleteEmployee: builder.mutation<void, number>({
      query: (id) => ({
        url: `employees/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, id) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
