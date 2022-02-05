import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginMutation($input: UsersPermissionsLoginInput!) {
    login(input: $input) {
      jwt
      user {
        id
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation RegisterMutation($input: UsersPermissionsRegisterInput!) {
    register(input: $input) {
      user {
        id
        confirmed
      }
      jwt
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $data: UsersPermissionsUserInput!) {
    updateUsersPermissionsUser(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;

export const UPLOAD_IMAGE_MUTATION = gql`
  mutation UploadImageMutation(
    $file: Upload!
    $ref: String!
    $refId: ID!
    $field: String!
  ) {
    upload(file: $file, ref: $ref, refId: $refId, field: $field) {
      data {
        attributes {
          name
        }
      }
    }
  }
`;

export const CREATE_PORTFOLIO_MUTATION = gql`
  mutation CreateProject($data: ProjectInput!) {
    createProject(data: $data) {
      data {
        id
      }
    }
  }
`;

export const CREATE_BUG_MUTATION = gql`
  mutation CreateBugInProject($data: ItemInput!) {
    createItem(data: $data) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_ITEM_STATUS_MUTATION = gql`
  mutation UpdateItemStatus ($id: ID!, $data: ItemInput!) {
  updateItem (id: $id data: $data) {
    data {
      id
    }
  }
}
`;