<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="xml" indent="yes" encoding="utf-8" omit-xml-declaration="yes"/>

	<xsl:param name="RecentlyViewedReportList" />
	<xsl:param name="QuickLinksReportList" />
	<xsl:param name="CurrentSectionCount" />
	<xsl:param name="ReportUrl" />
	<xsl:param name="GettingStartedPage" />
	<xsl:param name="ViewAllReportsPage" />
	<xsl:param name="ReportProcessorPage" />

	<!-- Navigate through every node (except the corresponding conditions below) and copy the node name and attributes.-->
	<xsl:template match="@* | node()">
		<xsl:copy>
			<xsl:apply-templates select="@* | node()"/>
		</xsl:copy>
	</xsl:template>

	<!-- Only apply this template to override the section id-->
	<xsl:template match="reports/section">
		<xsl:element name="section">
			<xsl:attribute name="ref">reports</xsl:attribute>
			<xsl:attribute name="id">
				<xsl:value-of select="$CurrentSectionCount+1"/>
			</xsl:attribute>			
			<xsl:apply-templates />
		</xsl:element>
	</xsl:template>

	<!-- Only apply this template to override the subsection id-->
	<xsl:template match="reports/section[@id=1]/subsection">
		<xsl:element name="subsection">
			<xsl:attribute name="id">
				<xsl:value-of select="($CurrentSectionCount+1)*100 + @id"/>
			</xsl:attribute>
			<xsl:apply-templates />
		</xsl:element>
	</xsl:template>
	
	<!-- Only apply this template when the navigation reaches favorites report section-->
	<xsl:template match="reports/section[@id=1]/subsection[@id=1]/title">
		<xsl:copy>
			<xsl:apply-templates select="@* | node()"/>
		</xsl:copy>

		<!-- Add quick links report tags here-->

		<!-- if quick links report does not exists, show getting started section-->
		<xsl:if test="count(($QuickLinksReportList)/*)=0">
			<item id="GettingStarted">
				<title>Getting Started</title>
				<pages>
					<page id="GettingStarted.aspx" default="true">
						<url completePath="true">
							<xsl:value-of select="concat($ReportUrl,'/Core/Interface/ReportsHome.aspx?PRoleId=152')" />
						</url>
					</page>
				</pages>
			</item>
		</xsl:if>
		
		<xsl:for-each select="($QuickLinksReportList)/*">
			<xsl:variable name="index" select="position()" />
			<xsl:element name="item">
				<xsl:attribute name="id">
					<xsl:value-of select="(($QuickLinksReportList)/*/@ID)[$index]" />
				</xsl:attribute>
				<xsl:element name="title">
					<xsl:value-of select="(($QuickLinksReportList)/*/ReportName)[$index]/child::node()" />
				</xsl:element>
				<xsl:element name="pages">
					<xsl:element name="page">
						<xsl:attribute name="id">
							<xsl:value-of select="(($QuickLinksReportList)/*/@ID)[$index]" />
						</xsl:attribute>
						<xsl:attribute name="default">true</xsl:attribute>
						<xsl:element name="url">
							<xsl:attribute name="completePath">true</xsl:attribute>
							<xsl:value-of select="concat($ReportUrl, concat($ReportProcessorPage, concat('?ReportID=', (($QuickLinksReportList)/*/@ID)[$index])))"/>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:for-each>
	</xsl:template>

	<!-- Only apply this template when the navigation recently viewed report section-->
	<xsl:template match="reports/section[@id=1]/subsection[@id=2]/title">
		<xsl:copy>
			<xsl:apply-templates select="@* | node()"/>
		</xsl:copy>

		<!-- Add recently viewed report tags here-->

		<!-- if recently view report does not exists, show view all reports section-->
		<!--<xsl:if test="count(($RecentlyViewedReportList)/*)=0">
			<item id="None">
				<title>None</title>
				<pages>
					<page id="None" default="true">
						<url completePath="true">
							<xsl:value-of select="concat($ReportUrl,'Priv/ManageRecentlyViewed.aspx')" />
						</url>
					</page>
				</pages>
			</item>
		</xsl:if>-->
		
		<xsl:for-each select="($RecentlyViewedReportList)/*">
			<xsl:variable name="index" select="position()" />
			<xsl:element name="item">
				<xsl:attribute name="id">
					<xsl:value-of select="(($RecentlyViewedReportList)/*/ReportPath)[$index]/child::node()" />
				</xsl:attribute>
				<xsl:element name="title">
					<xsl:value-of select="(($RecentlyViewedReportList)/*/ReportName)[$index]/child::node()" />
				</xsl:element>
				<xsl:element name="pages">
					<xsl:element name="page">
						<xsl:attribute name="id">
							<xsl:value-of select="(($RecentlyViewedReportList)/*/ReportPath)[$index]/child::node()" />
						</xsl:attribute>
						<xsl:attribute name="default">true</xsl:attribute>
						<xsl:element name="url">
							<xsl:attribute name="completePath">true</xsl:attribute>
							<xsl:value-of select="concat($ReportUrl, concat($ReportProcessorPage, concat('?ReportID=', (($RecentlyViewedReportList)/*/@ID)[$index])))"/>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:for-each>
	</xsl:template>
	

	<xsl:template match="reports/section[@id=1]/subsection[@id=3]/title">
		<xsl:copy>
			<xsl:apply-templates select="@* | node()"/>
		</xsl:copy>

		<item id="ViewAllReports">
			<title>View All</title>
			<pages>
				<page id="ViewAllReports.aspx" default="true">
					<url completePath="true">
						<xsl:value-of select="concat($ReportUrl,'/Core/Interface/ReportsModule/ReportsList.aspx?PRoleId=152')" />
					</url>
				</page>
			</pages>
		</item>
		<!--<item id="ViewAllFavorites">
			<title>View All Favorites</title>
			<pages>
				<page id="ViewAllFavorites.aspx" default="true">
					<url completePath="true">
						<xsl:value-of select="concat($ReportUrl,'Priv/ManageFavorites.aspx')" />
					</url>
				</page>
			</pages>
		</item>-->
	</xsl:template>


</xsl:stylesheet>