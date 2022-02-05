import { gql } from "@apollo/client";

export const USER_INFO_QUERY = gql`
  query GetUserInfo($id: ID!) {
    usersPermissionsUser(id: $id) {
      data {
        id
        attributes {
          firstName
          lastName
          position
          avatarPhoto {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;

export const PROJECTS_BY_USER_QUERY = gql`
  query GetProjectsByUser($id: IDFilterInput!) {
    projects(filters: { projectOwner: { id: $id } }) {
      data {
        id
        attributes {
          projectName
          projectDescription
          createdAt
          projectItems {
            data {
              id
            }
          }

          projectOwner {
            data {
              id
              attributes {
                firstName
                lastName
                avatarPhoto {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const PROJECT_BY_ID_QUERY = gql`
  query GetProjectById($id: ID!) {
    project(id: $id) {
      data {
        id
        attributes {
          projectName
          projectDescription
          gitUrl
          siteUrl
          createdAt
          featuredImage {
            data {
              attributes {
                url
              }
            }
          }
          projectItems {
            data {
              id
              attributes {
                itemName
              }
            }
          }
          projectOwner {
            data {
              attributes {
                firstName
                lastName
                email
                position
                avatarPhoto {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const BUGS_BY_ID_QUERY = gql`
  query GetBugsById($id: IDFilterInput) {
    items(filters: { project: { id: $id } }) {
      data {
        id
        attributes {
          itemName
          itemBrief
          type
          priority
          severity
          publishedAt
          dueDate
          createdAt
          status
          owner {
            data {
              attributes {
                firstName
                lastName
              }
            }
          }
        }
      }
    }
  }
`;

export const BUG_BY_ID_QUERY = gql`
  query GetItemById($id: ID!) {
    item(id: $id) {
      data {
        id
        attributes {
          itemName
          itemBrief
          description
        }
      }
    }
  }
`;

export const GET_ALL_ITEMS_BY_OWNER = gql`
  query GetAllBugsByOwner($id: IDFilterInput) {
    items(filters: { owner: { id: $id } }) {
      data {
        id

        attributes {
          itemName
          itemBrief
          type
          priority
          severity
          publishedAt
          dueDate
          createdAt
          status
          owner {
            data {
              attributes {
                firstName
                lastName
              }
            }
          }
        }
      }
    }
  }
`;
