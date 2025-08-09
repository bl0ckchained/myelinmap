// pages/visualizer.tsx
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/dashboard", // or "/dashboard?tab=visualizer" if you later read the tab from query
      permanent: false,
    },
  };
};

export default function VisualizerRedirect() {
  return null;
}
// This page is just a redirect to the dashboard
// It can be used to handle legacy URLs or to simplify navigation