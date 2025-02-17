import styled from 'styled-components';

export const Wrapper = styled.div`
    display: flex;
    justify-context: space-between;
    flex-direction: column;
    width: 100%;
    border: 1px solid lightblue;
    border-radius: 20px;
    height: 100%;
  
   
    button {
        border-radius: 0 0 20px 20px;
    }

    img{
        max-height: 280px;
        object-fit: contain;
        border-radius: 20px 20px 0 0;
    }
  h3{
    text-align: center;
    
  }

    div{
        font-family: Arial, Halvetica, sans-serif;
        padding: 1rem;
        height: 100%;
    }

`;

