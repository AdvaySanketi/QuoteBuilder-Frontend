import React from "react";
import Layout from "../components/layout/Layout";
import QuoteList from "../components/quotes/QuoteList";

const AllQuotesPage: React.FC = () => {
  return (
    <Layout>
      <QuoteList />
    </Layout>
  );
};

export default AllQuotesPage;
