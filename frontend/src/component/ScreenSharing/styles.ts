import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

export const VideoContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

export const Video = styled.video`
  max-width: 50%;
`;