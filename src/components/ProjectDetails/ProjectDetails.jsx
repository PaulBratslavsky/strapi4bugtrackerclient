import React from "react";
import styled from "styled-components";
import { PROJECT_BY_ID_QUERY } from "../../apollo/queries";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";
import { Box } from "@strapi/design-system";
import { useQuery } from "@apollo/client";

const Image = styled.img`
  display: block;
  width: 100%;
  height: 500px;
  object-fit: cover;
`;

const DetailsBox = styled(Box)`
  background: ${({ theme }) => theme.colors.neutral100};
  margin-top: 1rem;
  border-radius: 4px;

  h2 {
    color: ${({ theme }) => theme.colors.primary600};
    font-weight: bold;
    font-size: 1.75rem;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
  }

  p {
    margin-top: 1rem;
    color: ${({ theme }) => theme.colors.neutral700};
    font-size: 1.1rem;
    letter-spacing: 0.75px;
    line-height: 1.65rem;
  }

  .links-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3rem;

    svg {
      color: ${({ theme }) => theme.colors.primary600};
      font-size: 2.5rem;
    }
  }

  .links {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
`;

export default function ProjectDetails({ projectID }) {
  const { loading, error, data } = useQuery(PROJECT_BY_ID_QUERY, {
    variables: {
      id: projectID,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  const { data: project } = data.project;

  const { attributes } = project;

  const imageUrl = attributes.featuredImage.data.attributes.url;
  const fullUrl = process.env.REACT_APP_URL + imageUrl;

  const { projectName, projectDescription, gitUrl, siteUrl } = attributes;

  return (
    <Box padding={4}>
      <Image src={fullUrl} alt={attributes.projectName} />
      <DetailsBox padding={7}>
        {projectName && <h2>{projectName}</h2>}
        {projectDescription && <p>{projectDescription}</p>}

        <div className="links-container">
          {gitUrl && (
            <a href={gitUrl} target="_blank" rel="noreferrer" className="link">
              <BsGithub />
            </a>
          )}
          {siteUrl && (
            <a href={siteUrl} target="_blank" rel="noreferrer" className="link">
              <CgWebsite />
            </a>
          )}
        </div>
      </DetailsBox>
    </Box>
  );
}
