import styled, { keyframes } from 'styled-components';

const slideLeft = keyframes`
  from {
    opacity: 0;
    margin-left: 120%;
  }
  to {
    opacity: 1;
    margin-left: 0
  }
`;

const slideRight = keyframes`
  from {
    opacity: 1;
    margin-left: 0;
  }
  to {
    opacity: 0;
    margin-left: 120%;
  }
`;

const Toast = styled.div`
	overflow: hidden;
	margin-bottom: 10px;
	width: 300px;
	animation: ${({ datatype }) => (datatype === 'slide-left' ? slideLeft : slideRight)} 0.4s;
	animation-fill-mode: forwards;
	color: white;
	background: rgba(255, 255, 255, 0.25);
	// box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	backdrop-filter: blur(4px);
	-webkit-backdrop-filter: blur(4px);
	border-radius: 10px;
	border: 1px solid rgba(255, 255, 255, 0.18);
`;
const ProgressBar = styled.div`
	height: 5px;
	border-radius: 15px;
	background-color: ${({ itemType }) =>
		itemType === 'SUCCESS' ? '#65d266' : itemType === 'ERROR' ? '#ff0000' : '#504e4e'};
`;
const marginStyle = `
	margin: 0;
	padding: 5px 10px;
`;
const Title = styled.h3`
	${marginStyle}
`;
const Body = styled.p`
	${marginStyle}
`;

export { Toast, ProgressBar, Title, Body };
